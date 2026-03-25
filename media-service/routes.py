import requests
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Post
import logging
from sqlalchemy.exc import SQLAlchemyError

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

routes = Blueprint('routes', __name__)

@routes.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    try:
        claims = get_jwt_identity()
        username = claims['username'] if isinstance(claims, dict) else claims
        logger.debug(f"Username from JWT: {username}")

        data = request.json
        if not data or 'content' not in data:
            logger.error("Missing required 'content' field in request data")
            return jsonify(msg="Content is required"), 400

        post = Post(
            content=data['content'],
            description=data.get('description', ''),
            image_url=data.get('image_url', ''),
            username=username
        )

        db.session.add(post)
        db.session.commit()
        logger.info(f"Post created successfully by user {username} with ID {post.id}")

        saved_post = Post.query.filter_by(id=post.id).first()
        if saved_post:
            logger.debug(f"Verified: Post with ID {post.id} exists in database")
            return jsonify(msg=f"Post created by user {username}", post_id=post.id), 201
        else:
            logger.error("Post was committed but not found in database")
            return jsonify(msg="Failed to verify post in database"), 500

    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Database error: {str(e)}")
        return jsonify(msg=f"Database error: {str(e)}"), 500
    except Exception as e:
        db.session.rollback()
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify(msg=f"Unexpected error: {str(e)}"), 500

@routes.route('/posts', methods=['GET'])
@jwt_required()
def get_posts():
    posts = Post.query.all()
    combined_data = []

    for post in posts:
        try:
            res = requests.get(f'http://comment-service:8080/rest/comments/get/{post.id}')
            comments = res.json() if res.status_code == 200 else []
        except Exception as e:
            comments = []

        combined_data.append({
            'id': post.id,
            'content': post.content,
            'description': post.description,
            'image_url': post.image_url,
            'username': post.username,
            'created_at': post.created_at.isoformat(),
            'comments': comments
        })

    return jsonify(combined_data)

@routes.route('/posts/<int:id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    post = Post.query.get_or_404(post_id)
    data = request.json
    post.content = data.get('content', post.content)
    db.session.commit()
    return jsonify(msg="Post updated")

@routes.route('/posts/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify(msg="Post deleted")
