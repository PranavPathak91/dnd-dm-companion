# D&D Dungeon Master Companion App

A comprehensive web application for managing Dungeons & Dragons campaigns, including character tracking, monster management, and session notes.

## Features
- Campaign Management
- Character Tracking
- Monster Encyclopedia
- Session Notes
- Dice Roller

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm (comes with Node.js)

### Step 1: Clone the Repository
```bash
git clone https://github.com/PranavPathak91/dnd-dm-companion.git
cd dnd-dm-companion
```

### Step 2: Set Up Backend
1. Create and activate Python virtual environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

2. Install Python dependencies:
```bash
pip install flask flask-sqlalchemy flask-cors flask-marshmallow marshmallow-sqlalchemy
```

3. Start the Flask server:
```bash
python3 -m flask run --port 5001
```
The backend will be running on http://localhost:5001

### Step 3: Set Up Frontend
1. Open a new terminal window
2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install Node dependencies:
```bash
npm install
```

4. Start the React development server:
```bash
npm start
```
The frontend will automatically open in your browser at http://localhost:3000

## Using the Application

1. Create a Campaign:
   - Click "New Campaign" on the home page
   - Fill in campaign details
   - Click "Create"

2. Manage Characters:
   - Navigate to Characters page
   - Add new characters
   - Update character levels and stats

3. Track Session Notes:
   - Go to Sessions page
   - Click "New Session"
   - Select campaign
   - Add date and notes
   - Save your session

4. Use Dice Roller:
   - Navigate to Dice Roller
   - Select dice type
   - Enter number of dice
   - Click "Roll!"

## Technologies Used
- Backend: Flask (Python)
- Frontend: React
- Database: SQLite
- State Management: Redux Toolkit
- Styling: Tailwind CSS

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Troubleshooting

### Common Issues:

1. "Address already in use" error:
   - Kill the process using the port:
     ```bash
     # For backend (port 5001)
     lsof -i :5001
     kill -9 <PID>
     
     # For frontend (port 3000)
     lsof -i :3000
     kill -9 <PID>
     ```

2. "Module not found" error:
   - Make sure you're in the correct directory
   - Ensure virtual environment is activated
   - Try reinstalling dependencies

3. Database issues:
   - Delete the existing database file (if any)
   - Restart the backend server

For more help, please open an issue on GitHub.
