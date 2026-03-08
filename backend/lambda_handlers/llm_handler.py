import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../shared"))
sys.path.append(os.path.join(os.path.dirname(__file__), "../services/llm-service/src"))

from mangum import Mangum
from services.llm_service.src.main import app

handler = Mangum(app, lifespan="off")
