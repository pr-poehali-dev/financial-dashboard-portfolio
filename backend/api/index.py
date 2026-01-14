"""API для работы с балансами, депозитами и транзакциями"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from decimal import Decimal


def decimal_default(obj):
    """Конвертер Decimal в float для JSON"""
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError


def handler(event: dict, context) -> dict:
    """Обработка операций с балансами и транзакциями"""
    method = event.get('httpMethod', 'GET')
    path = event.get('queryStringParameters', {}).get('action', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        
        if method == 'GET' and path == 'user_data':
            telegram_id = event.get('queryStringParameters', {}).get('telegram_id')
            if not telegram_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'telegram_id required'})
                }
            
            cursor.execute(f"SELECT * FROM {schema}.users WHERE telegram_id = %s", (telegram_id,))
            user = cursor.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'})
                }
            
            cursor.execute(
                f"""SELECT * FROM {schema}.deposits WHERE user_id = %s AND status = 'active' 
                   ORDER BY created_at DESC""",
                (user['id'],)
            )
            deposits = cursor.fetchall()
            
            cursor.execute(
                f"""SELECT * FROM {schema}.transactions WHERE user_id = %s 
                   ORDER BY created_at DESC LIMIT 50""",
                (user['id'],)
            )
            transactions = cursor.fetchall()
            
            cursor.execute(
                f"""SELECT u.username, u.first_name, r.bonus_paid, r.total_deposits, r.created_at,
                          CASE WHEN COUNT(d.id) > 0 THEN TRUE ELSE FALSE END as active
                   FROM {schema}.referrals r
                   JOIN {schema}.users u ON u.id = r.referred_id
                   LEFT JOIN {schema}.deposits d ON d.user_id = u.id AND d.status = 'active'
                   WHERE r.referrer_id = %s
                   GROUP BY u.id, u.username, u.first_name, r.bonus_paid, r.total_deposits, r.created_at
                   ORDER BY r.created_at DESC""",
                (user['id'],)
            )
            referrals = cursor.fetchall()
            
            cursor.execute(
                f"SELECT COUNT(*) as count FROM {schema}.referrals WHERE referrer_id = %s",
                (user['id'],)
            )
            referral_count = cursor.fetchone()['count']
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'user': dict(user),
                    'deposits': [dict(d) for d in deposits],
                    'transactions': [dict(t) for t in transactions],
                    'referrals': [dict(r) for r in referrals],
                    'referral_count': referral_count
                }, default=decimal_default)
            }
        
        elif method == 'POST' and path == 'create_deposit':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            amount = body.get('amount')
            
            if not user_id or not amount:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id and amount required'})
                }
            
            cursor.execute(
                f"SELECT value FROM {schema}.settings WHERE key = 'min_deposit'"
            )
            min_deposit = float(cursor.fetchone()['value'])
            
            if float(amount) < min_deposit:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': f'Minimum deposit is {min_deposit}'})
                }
            
            cursor.execute(
                f"INSERT INTO {schema}.transactions (user_id, type, amount, status) VALUES (%s, 'deposit', %s, 'pending') RETURNING *",
                (user_id, amount)
            )
            transaction = cursor.fetchone()
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'transaction': dict(transaction)}, default=decimal_default)
            }
        
        elif method == 'POST' and path == 'create_withdrawal':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            amount = body.get('amount')
            card_number = body.get('card_number')
            
            if not all([user_id, amount, card_number]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id, amount and card_number required'})
                }
            
            cursor.execute(f"SELECT * FROM {schema}.users WHERE id = %s", (user_id,))
            user = cursor.fetchone()
            
            cursor.execute(f"SELECT value FROM {schema}.settings WHERE key = 'min_withdrawal'")
            min_withdrawal = float(cursor.fetchone()['value'])
            
            if float(amount) < min_withdrawal:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': f'Minimum withdrawal is {min_withdrawal}'})
                }
            
            if float(amount) > float(user['available_balance']):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Insufficient available balance'})
                }
            
            cursor.execute(
                f"""INSERT INTO {schema}.transactions (user_id, type, amount, card_number, status) 
                   VALUES (%s, 'withdrawal', %s, %s, 'pending') RETURNING *""",
                (user_id, amount, card_number)
            )
            transaction = cursor.fetchone()
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'transaction': dict(transaction)}, default=decimal_default)
            }
        
        elif method == 'POST' and path == 'claim_bonus':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            bonus_type = body.get('bonus_type')
            
            if not all([user_id, bonus_type]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id and bonus_type required'})
                }
            
            cursor.execute(f"SELECT * FROM {schema}.users WHERE id = %s", (user_id,))
            user = cursor.fetchone()
            
            if bonus_type == 'chat':
                if user['chat_bonus_claimed']:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Bonus already claimed'})
                    }
                
                cursor.execute(f"SELECT value FROM {schema}.settings WHERE key = 'chat_bonus'")
                bonus_amount = float(cursor.fetchone()['value'])
                
                cursor.execute(
                    f"""UPDATE {schema}.users 
                       SET balance = balance + %s, 
                           available_balance = available_balance + %s,
                           chat_bonus_claimed = TRUE 
                       WHERE id = %s""",
                    (bonus_amount, bonus_amount, user_id)
                )
                
                cursor.execute(
                    f"INSERT INTO {schema}.transactions (user_id, type, amount, status, description) VALUES (%s, 'bonus', %s, 'completed', 'Chat bonus')",
                    (user_id, bonus_amount)
                )
                
            elif bonus_type == 'referral':
                cursor.execute(
                    f"SELECT COUNT(*) as count FROM {schema}.referrals WHERE referrer_id = %s",
                    (user_id,)
                )
                ref_count = cursor.fetchone()['count']
                
                cursor.execute(f"SELECT value FROM {schema}.settings WHERE key = 'referral_bonus_target'")
                target = int(cursor.fetchone()['value'])
                
                if ref_count < target:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': f'Need {target} referrals, you have {ref_count}'})
                    }
                
                if user['referral_bonus_claimed']:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Bonus already claimed'})
                    }
                
                cursor.execute(f"SELECT value FROM {schema}.settings WHERE key = 'referral_bonus_amount'")
                bonus_amount = float(cursor.fetchone()['value'])
                
                cursor.execute(
                    f"""UPDATE {schema}.users 
                       SET balance = balance + %s,
                           available_balance = available_balance + %s,
                           referral_bonus_claimed = TRUE 
                       WHERE id = %s""",
                    (bonus_amount, bonus_amount, user_id)
                )
                
                cursor.execute(
                    f"INSERT INTO {schema}.transactions (user_id, type, amount, status, description) VALUES (%s, 'bonus', %s, 'completed', 'Referral bonus')",
                    (user_id, bonus_amount)
                )
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'bonus_amount': bonus_amount})
            }
        
        elif method == 'GET' and path == 'settings':
            cursor.execute(f"SELECT * FROM {schema}.settings")
            settings_list = cursor.fetchall()
            settings = {s['key']: s['value'] for s in settings_list}
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'settings': settings})
            }
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unknown action'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
