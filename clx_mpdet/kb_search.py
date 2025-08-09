# Crowe Logic™ Proprietary
from __future__ import annotations
from typing import List, Dict

class KbNotBuilt(Exception):
    pass

def search(q: str, top_k: int = 5) -> List[Dict[str, str]]:
    raise KbNotBuilt("KB not available")
