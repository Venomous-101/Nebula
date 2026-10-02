# Run this anywhere, forever.
#
#   docker build -t breakup-recovery .
#   docker run -p 8501:8501 breakup-recovery
#
# Then open http://localhost:8501 and paste an API key in the sidebar.
FROM python:3.11-slim

WORKDIR /app

# Dependencies first: this layer is cached while only the app source changes.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8501

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://localhost:8501/_stcore/health', timeout=4).status==200 else 1)"

CMD ["streamlit", "run", "ai_breakup_recovery_agent.py", \
     "--server.address=0.0.0.0", \
     "--server.port=8501", \
     "--server.headless=true", \
     "--browser.gatherUsageStats=false"]
