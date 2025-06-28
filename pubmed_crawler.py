
"""pubmed_crawler.py
Script to search PubMed for mushroom cultivation studies and export metadata.

Usage example (inside Replit shell):
  python pubmed_crawler.py --query "mushroom cultivation" --max 100 --outfile results.json

To speed up requests, set your NCBI API key as an env variable:
  export NCBI_API_KEY="YOUR_KEY_HERE"

Requirements:
  pip install requests
"""

import argparse
import json
import os
import time
from typing import List, Dict, Any, Optional
from urllib.parse import urlencode

import requests

BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
EMAIL = "info@southwestmushrooms.com"  # Replace or parameterize as needed


def esearch(query: str, retmax: int = 100, api_key: Optional[str] = None) -> List[str]:
    """Return a list of PMIDs matching a PubMed query."""
    params = {
        "db": "pubmed",
        "term": query,
        "retmax": retmax,
        "retmode": "json",
        "api_key": api_key,
        "email": EMAIL,
    }
    url = f"{BASE_URL}/esearch.fcgi?{urlencode(params)}"
    r = requests.get(url, timeout=15)
    r.raise_for_status()
    return r.json()["esearchresult"]["idlist"]


def esummary(pmids: List[str], api_key: Optional[str] = None) -> List[Dict[str, Any]]:
    """Return summary metadata for a list of PMIDs."""
    ids = ",".join(pmids)
    params = {
        "db": "pubmed",
        "id": ids,
        "retmode": "json",
        "api_key": api_key,
        "email": EMAIL,
    }
    url = f"{BASE_URL}/esummary.fcgi?{urlencode(params)}"
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    data = r.json()["result"]
    uids = data.pop("uids", [])
    return [data[uid] for uid in uids]


def build_record(summary: Dict[str, Any]) -> Dict[str, Any]:
    """Map PubMed summary fields to our cultivation schema (basic version)."""
    record = {
        "species": "",  # Placeholder – needs further NLP extraction
        "strain": "",
        "substrate": "",
        "temperature": None,
        "humidity": None,
        "yield": None,
        "colonization_days": None,
        "fruiting_days": None,
        "enzymatic_activity": {},
        "supplements": "",
        "study_link": f"https://pubmed.ncbi.nlm.nih.gov/{summary['uid']}/",
        "pubmed_id": summary["uid"],
        "authors": [a["name"] for a in summary.get("authors", [])],
        "journal": summary.get("fulljournalname"),
        "year": int(summary.get("pubdate", "0")[:4]) if summary.get("pubdate") else None,
        "title": summary.get("title"),
    }
    return record


def crawl(query: str, retmax: int, api_key: Optional[str]) -> List[Dict[str, Any]]:
    pmids = esearch(query, retmax, api_key)
    print(f"Found {len(pmids)} PMIDs for '{query}'")
    batch_size = 200
    records: List[Dict[str, Any]] = []
    for i in range(0, len(pmids), batch_size):
        batch = pmids[i : i + batch_size]
        summaries = esummary(batch, api_key)
        for s in summaries:
            records.append(build_record(s))
        # NCBI recommends no more than 3 requests per second with an API key
        time.sleep(0.34)
    return records


def main():
    parser = argparse.ArgumentParser(description="PubMed crawler for mushroom cultivation studies")
    parser.add_argument("--query", required=True, help="Search term, e.g. 'mushroom cultivation'")
    parser.add_argument("--max", type=int, default=100, help="Maximum number of results to fetch")
    parser.add_argument("--outfile", default="pubmed_results.json", help="Output JSON filename")
    parser.add_argument(
        "--api-key",
        default=os.getenv("NCBI_API_KEY"),
        help="NCBI API key (env var NCBI_API_KEY will be used if not supplied)",
    )
    args = parser.parse_args()

    records = crawl(args.query, args.max, args.api_key)
    with open(args.outfile, "w") as fh:
        json.dump(records, fh, indent=2)
    print(f"Wrote {len(records)} records to {args.outfile}")


if __name__ == "__main__":
    main()
