import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User registration and login with database storage
    Args: event with httpMethod, body (name, email, password, action)
    Returns: HTTP response with user data or error
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    action = body_data.get('action')
    email = body_data.get('email', '').strip()
    password = body_data.get('password', '')
    name = body_data.get('name', '').strip()
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    conn.autocommit = True
    cur = conn.cursor()
    
    if action == 'register':
        if not name or not email or not password:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'All fields required'})
            }
        
        cur.execute(
            "SELECT id FROM t_p10357889_gto_results_portal.users WHERE email = %s",
            (email,)
        )
        if cur.fetchone():
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Email already exists'})
            }
        
        cur.execute(
            "INSERT INTO t_p10357889_gto_results_portal.users (name, email, password) VALUES (%s, %s, %s) RETURNING id, name, email, is_admin",
            (name, email, password)
        )
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'id': user[0],
                'name': user[1],
                'email': user[2],
                'isAdmin': user[3]
            })
        }
    
    elif action == 'login':
        if not email or not password:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Email and password required'})
            }
        
        cur.execute(
            "SELECT id, name, email, is_admin FROM t_p10357889_gto_results_portal.users WHERE email = %s AND password = %s",
            (email, password)
        )
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        if not user:
            return {
                'statusCode': 401,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid credentials'})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'id': user[0],
                'name': user[1],
                'email': user[2],
                'isAdmin': user[3]
            })
        }
    
    cur.close()
    conn.close()
    return {
        'statusCode': 400,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Invalid action'})
    }
