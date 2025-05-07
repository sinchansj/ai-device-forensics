from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.call_processor import process_call_data, process_call_type_data, process_top_contacts
from api.message_processor import process_message_data, process_hourly_distribution
from api.stats_utils import get_forensic_stats
from api.sms_analyzer import get_sms_analysis
from api.hidden_files_processor import process_hidden_files
from api.ai_report import get_ai_report  # Add this import

app = FastAPI()

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/call-data")
async def get_call_data():
    return process_call_data()

@app.get("/api/call-type-data")
async def get_call_type_data():
    return process_call_type_data()

@app.get("/api/top-contacts")
async def get_top_contacts():
    return process_top_contacts()

@app.get("/api/message-data")
async def get_message_data():
    return process_message_data()

@app.get("/api/message-hourly")
async def get_message_hourly():
    return process_hourly_distribution()

@app.get("/api/stats")
async def get_stats():
    return get_forensic_stats()

@app.get("/api/sms-analysis")
async def sms_analysis_endpoint():
    """Get AI analysis of SMS messages"""
    return get_sms_analysis()

@app.get("/api/hidden-files")
async def get_hidden_files():
    """Get list of hidden files detected during analysis"""
    return process_hidden_files()

@app.get("/api/ai-report")
async def get_ai_report_endpoint():
    """Get the comprehensive AI forensic report"""
    return get_ai_report()