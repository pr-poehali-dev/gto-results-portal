import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get all users for admin panel
    Args: event with httpMethod, headers (X-Admin-Email)
    Returns: HTTP response with list of users
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Email',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    headers = event.get('headers', {})
    admin_email = headers.get('X-Admin-Email') or headers.get('x-admin-email')
    
    if not admin_email:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Admin email required'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    conn.autocommit = True
    cur = conn.cursor()
    
    cur.execute(
        "SELECT is_admin FROM t_p10357889_gto_results_portal.users WHERE email = %s",
        (admin_email,)
    )
    admin_check = cur.fetchone()
    
    if not admin_check or not admin_check[0]:
        cur.close()
        conn.close()
        return {
            'statusCode': 403,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Access denied'})
        }
    
    cur.execute(
        "SELECT id, name, email, password, created_at FROM t_p10357889_gto_results_portal.users ORDER BY created_at DESC"
    )
    users = cur.fetchall()
    cur.close()
    conn.close()
    
    users_list = [
        {
            'id': user[0],
            'name': user[1],
            'email': user[2],
            'password': user[3],
            'createdAt': user[4].isoformat() if user[4] else None
        }
        for user in users
    ]
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'users': users_list})
    }
