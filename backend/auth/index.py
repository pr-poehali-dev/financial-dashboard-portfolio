"""API для авторизации пользователей через Telegram"""
import json
import os
import hashlib
import random
import string
import psycopg2
from psycopg2.extras import RealDictCursor
from decimal import Decimal


def decimal_default(obj):
    """Конвертер Decimal в float для JSON"""
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError


def generate_referral_code(telegram_id: int) -> str:
    """Генерация уникального реферального кода"""
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{telegram_id % 10000}{random_part}"


def handler(event: dict, context) -> dict:
    """Авторизация пользователя через Telegram и создание/обновление профиля"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Telegram-Init-Data'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        telegram_id = body.get('telegram_id')
        username = body.get('username')
        first_name = body.get('first_name')
        last_name = body.get('last_name')
        referral_code_used = body.get('referral_code')
        
        if not telegram_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'telegram_id is required'})
            }
        
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
        
        cursor.execute(
            f"SELECT * FROM {schema}.users WHERE telegram_id = %s",
            (telegram_id,)
        )
        user = cursor.fetchone()
        
        if user:
            cursor.execute(
                f"""UPDATE {schema}.users 
                   SET username = %s, first_name = %s, last_name = %s, updated_at = CURRENT_TIMESTAMP
                   WHERE telegram_id = %s
                   RETURNING *""",
                (username, first_name, last_name, telegram_id)
            )
            user = cursor.fetchone()
            conn.commit()
            
            is_admin = user['username'] == 'Invest_Pasive' if user['username'] else False
            if is_admin and not user['is_admin']:
                cursor.execute(
                    f"UPDATE {schema}.users SET is_admin = TRUE WHERE id = %s",
                    (user['id'],)
                )
                conn.commit()
            
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
                    'referral_count': referral_count,
                    'is_new': False
                }, default=decimal_default)
            }
        
        ref_code = generate_referral_code(telegram_id)
        referrer_id = None
        
        if referral_code_used:
            cursor.execute(
                f"SELECT id FROM {schema}.users WHERE referral_code = %s",
                (referral_code_used,)
            )
            referrer = cursor.fetchone()
            if referrer:
                referrer_id = referrer['id']
        
        is_admin = username == 'Invest_Pasive' if username else False
        
        cursor.execute(
            f"""INSERT INTO {schema}.users 
               (telegram_id, username, first_name, last_name, referral_code, referred_by, is_admin)
               VALUES (%s, %s, %s, %s, %s, %s, %s)
               RETURNING *""",
            (telegram_id, username, first_name, last_name, ref_code, referrer_id, is_admin)
        )
        user = cursor.fetchone()
        
        if referrer_id:
            cursor.execute(
                f"""INSERT INTO {schema}.referrals (referrer_id, referred_id)
                   VALUES (%s, %s)""",
                (referrer_id, user['id'])
            )
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'user': dict(user),
                'referral_count': 0,
                'is_new': True
            }, default=decimal_default)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }