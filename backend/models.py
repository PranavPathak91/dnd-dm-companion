from flask_sqlalchemy import SQLAlchemy
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from datetime import datetime

db = SQLAlchemy()

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    characters = db.relationship('Character', backref='campaign', lazy=True)
    sessions = db.relationship('Session', backref='campaign', lazy=True)

class Character(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    race = db.Column(db.String(50))
    character_class = db.Column(db.String(50))
    level = db.Column(db.Integer, default=1)
    hit_points = db.Column(db.Integer)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaign.id'), nullable=False)

class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaign.id'), nullable=False)

class Monster(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    challenge_rating = db.Column(db.Float)
    hit_points = db.Column(db.Integer)
    armor_class = db.Column(db.Integer)
    description = db.Column(db.Text)

# Marshmallow Schemas for Serialization
class CampaignSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Campaign
        include_relationships = True
        load_instance = True

class CharacterSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Character
        include_relationships = True
        load_instance = True

class SessionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Session
        include_relationships = True
        load_instance = True

class MonsterSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Monster
        load_instance = True
