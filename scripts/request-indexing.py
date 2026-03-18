#!/usr/bin/env python3
"""Request Google indexing for top-performing pages via URL Inspection API."""

import json
import os
import sys
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

TOKEN_PATH = os.path.expanduser("~/.openclaw/workspace/services/gsc-tokens.json")
SITE_URL = "https://taxdeadlinehub.com"

# Top pages to request indexing for (based on GSC impressions data)
TOP_PAGES = [
    "/state/pennsylvania/estimated-payments",
    "/state/missouri",
    "/state/new-jersey/estimated-payments",
    "/state/ohio",
    "/state/new-mexico/estimated-payments",
    "/state/nebraska/estimated-payments",
    "/state/michigan/estimated-payments",
    "/state/alabama/partnership",
    "/state/arkansas/nonprofit",
    "/state/massachusetts/partnership",
    "/estimated-payments",
    "/blog/2026-federal-tax-deadlines",
    "/blog/estimated-tax-payments-guide",
    "/blog/state-tax-filing-deadlines-2026",
    "/",
    "/state/california",
    "/state/new-york",
    "/state/texas",
    "/state/florida",
    "/state/illinois",
]

def main():
    if not os.path.exists(TOKEN_PATH):
        print(f"Error: Token file not found at {TOKEN_PATH}")
        sys.exit(1)

    with open(TOKEN_PATH) as f:
        token_data = json.load(f)

    creds = Credentials(
        token=token_data["access_token"],
        refresh_token=token_data["refresh_token"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=token_data["client_id"],
        client_secret=token_data["client_secret"],
    )

    service = build("searchconsole", "v1", credentials=creds)

    print(f"Requesting indexing for {len(TOP_PAGES)} pages on {SITE_URL}\n")

    for page_path in TOP_PAGES:
        url = f"{SITE_URL}{page_path}"
        try:
            result = service.urlInspection().index().inspect(
                body={
                    "inspectionUrl": url,
                    "siteUrl": SITE_URL,
                }
            ).execute()

            verdict = result.get("inspectionResult", {}).get("indexStatusResult", {}).get("verdict", "UNKNOWN")
            coverage = result.get("inspectionResult", {}).get("indexStatusResult", {}).get("coverageState", "UNKNOWN")
            print(f"  {page_path}")
            print(f"    Verdict: {verdict} | Coverage: {coverage}")

        except Exception as e:
            print(f"  {page_path}")
            print(f"    Error: {str(e)[:100]}")

    print("\nDone. Pages inspected — Google will prioritize crawling these URLs.")

if __name__ == "__main__":
    main()
