from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Campaign, Character, Session, Monster
from models import CampaignSchema, CharacterSchema, SessionSchema, MonsterSchema
import random
import logging
import sys
import traceback
from datetime import datetime
import re

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dnd_companion.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": True
    }
})

db.init_app(app)

# Initialize Schemas
campaign_schema = CampaignSchema()
campaigns_schema = CampaignSchema(many=True)
character_schema = CharacterSchema()
characters_schema = CharacterSchema(many=True)
session_schema = SessionSchema()
sessions_schema = SessionSchema(many=True)
monster_schema = MonsterSchema()
monsters_schema = MonsterSchema(many=True)

@app.route('/test', methods=['GET'])
def test():
    return jsonify({
        "message": "API is working",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/monsters', methods=['GET', 'POST'])
def handle_monsters():
    try:
        if request.method == 'POST':
            data = request.json
            logger.debug('Creating new monster with data: %s', data)
            
            # Validate required fields
            required_fields = ['name']
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400
            
            # Create monster
            new_monster = Monster(
                name=data['name'],
                challenge_rating=data.get('challenge_rating', 0.0),
                hit_points=data.get('hit_points', 10),
                armor_class=data.get('armor_class', 10),
                description=data.get('description', '')
            )
            
            db.session.add(new_monster)
            db.session.commit()
            logger.info('Successfully created monster with id: %s', new_monster.id)
            return jsonify(monster_schema.dump(new_monster)), 201
        
        # GET request
        logger.debug('Fetching all monsters')
        monsters = Monster.query.all()
        logger.info('Successfully fetched %d monsters', len(monsters))
        return jsonify(monsters_schema.dump(monsters))
    except Exception as e:
        logger.error('Error in handle_monsters: %s', str(e))
        logger.error('Traceback: %s', traceback.format_exc())
        if request.method == 'POST':
            db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/monsters/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_monster(id):
    try:
        monster = Monster.query.get_or_404(id)
        logger.debug('Found monster: %s', monster)
        
        if request.method == 'GET':
            return jsonify(monster_schema.dump(monster))
        
        if request.method == 'DELETE':
            db.session.delete(monster)
            db.session.commit()
            logger.info('Successfully deleted monster with id: %d', id)
            return jsonify({"message": "Monster deleted successfully"}), 204
        
        # PUT request
        data = request.json
        logger.debug('Updating monster with data: %s', data)
        
        # Update allowed fields
        allowed_fields = ['name', 'challenge_rating', 'hit_points', 'armor_class', 'description']
        for field in allowed_fields:
            if field in data:
                setattr(monster, field, data[field])
        
        db.session.commit()
        logger.info('Successfully updated monster with id: %d', id)
        return jsonify(monster_schema.dump(monster))
    except Exception as e:
        logger.error('Error in handle_monster: %s', str(e))
        logger.error('Traceback: %s', traceback.format_exc())
        if request.method in ['PUT', 'DELETE']:
            db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/characters', methods=['GET', 'POST'])
def handle_characters():
    try:
        if request.method == 'POST':
            data = request.json
            logger.debug('Creating new character with data: %s', data)
            
            # Validate required fields
            required_fields = ['name', 'campaign_id']
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400
            
            # Validate campaign exists
            campaign = Campaign.query.get(data['campaign_id'])
            if not campaign:
                return jsonify({"error": f"Campaign with id {data['campaign_id']} not found"}), 404
            
            # Create character
            new_character = Character(
                name=data['name'],
                race=data.get('race', ''),
                character_class=data.get('character_class', ''),
                level=data.get('level', 1),
                hit_points=data.get('hit_points', 10),
                campaign_id=data['campaign_id']
            )
            
            db.session.add(new_character)
            db.session.commit()
            logger.info('Successfully created character with id: %s', new_character.id)
            return jsonify(character_schema.dump(new_character)), 201
        
        logger.debug('Fetching all characters')
        characters = Character.query.all()
        logger.info('Successfully fetched %d characters', len(characters))
        return jsonify(characters_schema.dump(characters))
    except Exception as e:
        logger.error('Error in handle_characters: %s', str(e))
        logger.error('Traceback: %s', traceback.format_exc())
        if request.method == 'POST':
            db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/characters/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_character(id):
    try:
        character = Character.query.get_or_404(id)
        logger.debug('Found character: %s', character)
        
        if request.method == 'GET':
            response = jsonify(character_schema.dump(character))
            return response
        
        if request.method == 'DELETE':
            db.session.delete(character)
            db.session.commit()
            logger.info('Successfully deleted character with id: %d', id)
            response = jsonify({"message": "Character deleted successfully"})
            return response, 204
        
        # PUT request
        data = request.json
        logger.debug('Updating character with data: %s', data)

        # Validate level
        if 'level' in data:
            new_level = data['level']
            if not isinstance(new_level, int) or new_level < 1 or new_level > 20:
                return jsonify({"error": "Level must be between 1 and 20"}), 400

        # Update allowed fields
        allowed_fields = ['name', 'race', 'character_class', 'level', 'hit_points']
        for field in allowed_fields:
            if field in data:
                setattr(character, field, data[field])
        
        db.session.commit()
        logger.info('Successfully updated character with id: %d', id)
        return jsonify(character_schema.dump(character))
    except Exception as e:
        logger.error('Error in handle_character: %s', str(e))
        logger.error('Traceback: %s', traceback.format_exc())
        if request.method in ['PUT', 'DELETE']:
            db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/campaigns', methods=['GET', 'POST'])
def handle_campaigns():
    try:
        if request.method == 'POST':
            logger.debug('Creating new campaign with data: %s', request.json)
            new_campaign = campaign_schema.load(request.json, session=db.session)
            db.session.add(new_campaign)
            db.session.commit()
            logger.info('Successfully created campaign with id: %s', new_campaign.id)
            response = jsonify(campaign_schema.dump(new_campaign))
            return response, 201
        
        logger.debug('Fetching all campaigns')
        campaigns = Campaign.query.all()
        logger.info('Successfully fetched %d campaigns', len(campaigns))
        response = jsonify(campaigns_schema.dump(campaigns))
        return response
    except Exception as e:
        logger.error('Error in handle_campaigns: %s', str(e))
        logger.error('Traceback: %s', traceback.format_exc())
        if request.method == 'POST':
            db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/campaigns/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_campaign(id):
    try:
        campaign = Campaign.query.get_or_404(id)
        logger.debug('Found campaign: %s', campaign)
        
        if request.method == 'GET':
            response = jsonify(campaign_schema.dump(campaign))
            return response
        
        if request.method == 'DELETE':
            db.session.delete(campaign)
            db.session.commit()
            logger.info('Successfully deleted campaign with id: %d', id)
            response = jsonify({"message": "Campaign deleted successfully"})
            return response, 204
        
        # PUT request
        logger.debug('Updating campaign with data: %s', request.json)
        data = request.json
        for key, value in data.items():
            setattr(campaign, key, value)
        db.session.commit()
        logger.info('Successfully updated campaign with id: %d', id)
        response = jsonify(campaign_schema.dump(campaign))
        return response
    except Exception as e:
        logger.error('Error in handle_campaign: %s', str(e))
        logger.error('Traceback: %s', traceback.format_exc())
        if request.method in ['PUT', 'DELETE']:
            db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/sessions', methods=['GET', 'POST'])
def handle_sessions():
    try:
        if request.method == 'POST':
            data = request.json
            logger.debug('Creating new session with data: %s', data)
            
            # Validate required fields
            required_fields = ['campaign_id', 'date', 'notes']
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400
            
            # Validate campaign exists
            campaign = Campaign.query.get(data['campaign_id'])
            if not campaign:
                return jsonify({"error": f"Campaign with id {data['campaign_id']} not found"}), 404
            
            # Create session
            new_session = Session(
                campaign_id=data['campaign_id'],
                date=datetime.fromisoformat(data['date'].replace('Z', '+00:00')),
                notes=data['notes']
            )
            
            db.session.add(new_session)
            db.session.commit()
            logger.info('Successfully created session with id: %s', new_session.id)
            return jsonify(session_schema.dump(new_session)), 201
        
        # GET request
        campaign_id = request.args.get('campaign_id')
        query = Session.query
        
        if campaign_id:
            query = query.filter_by(campaign_id=campaign_id)
        
        sessions = query.order_by(Session.date.desc()).all()
        logger.info('Successfully fetched %d sessions', len(sessions))
        return jsonify(sessions_schema.dump(sessions))
    except Exception as e:
        logger.error('Error in handle_sessions: %s', str(e))
        logger.error('Traceback: %s', traceback.format_exc())
        if request.method == 'POST':
            db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/sessions/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_session(id):
    try:
        session = Session.query.get_or_404(id)
        logger.debug('Found session: %s', session)
        
        if request.method == 'GET':
            return jsonify(session_schema.dump(session))
        
        if request.method == 'DELETE':
            db.session.delete(session)
            db.session.commit()
            logger.info('Successfully deleted session with id: %d', id)
            return jsonify({"message": "Session deleted successfully"}), 204
        
        # PUT request
        data = request.json
        logger.debug('Updating session with data: %s', data)
        
        # Update allowed fields
        allowed_fields = ['notes']
        for field in allowed_fields:
            if field in data:
                setattr(session, field, data[field])
        
        # Handle date separately since it needs conversion
        if 'date' in data:
            session.date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
        
        db.session.commit()
        logger.info('Successfully updated session with id: %d', id)
        return jsonify(session_schema.dump(session))
    except Exception as e:
        logger.error('Error in handle_session: %s', str(e))
        logger.error('Traceback: %s', traceback.format_exc())
        if request.method in ['PUT', 'DELETE']:
            db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Add dice rolling endpoint
@app.route('/roll', methods=['POST'])
def roll_dice():
    try:
        data = request.json
        logger.debug('Rolling dice with data: %s', data)
        
        # Validate required fields
        if 'dice' not in data:
            return jsonify({"error": "Missing required field: dice"}), 400
        
        dice_notation = data['dice']
        # Validate dice notation (e.g., "2d6", "1d20", "3d8")
        pattern = re.compile(r'^(\d+)d(\d+)$')
        match = pattern.match(dice_notation)
        
        if not match:
            return jsonify({"error": "Invalid dice notation. Use format: NdM (e.g., 2d6)"}), 400
        
        num_dice = int(match.group(1))
        num_sides = int(match.group(2))
        
        # Validate reasonable limits
        if num_dice < 1 or num_dice > 100:
            return jsonify({"error": "Number of dice must be between 1 and 100"}), 400
        if num_sides < 2 or num_sides > 100:
            return jsonify({"error": "Number of sides must be between 2 and 100"}), 400
        
        # Roll the dice
        rolls = [random.randint(1, num_sides) for _ in range(num_dice)]
        total = sum(rolls)
        
        result = {
            "rolls": rolls,
            "total": total,
            "dice": dice_notation
        }
        
        logger.info('Successfully rolled dice: %s = %s (total: %d)', dice_notation, rolls, total)
        return jsonify(result)
    except Exception as e:
        logger.error('Error in roll_dice: %s', str(e))
        logger.error('Traceback: %s', traceback.format_exc())
        return jsonify({"error": str(e)}), 500

# Initialize Database
with app.app_context():
    try:
        logger.info('Initializing database...')
        db.create_all()
        
        # Add a test campaign if none exist
        if Campaign.query.count() == 0:
            test_campaign = Campaign(
                name="The Lost Mine of Phandelver",
                description="A D&D 5E adventure for levels 1-5. The adventurers are hired to escort supplies to the frontier town of Phandalin."
            )
            db.session.add(test_campaign)
            db.session.commit()
            logger.info('Added test campaign')
        
        logger.info('Database initialized successfully')
    except Exception as e:
        logger.error('Error initializing database: %s', str(e))
        logger.error('Traceback: %s', traceback.format_exc())

logger.info('Starting Flask server on port 5001...')
if __name__ == '__main__':
    app.run(debug=True, port=5001)
