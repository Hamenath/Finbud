import urllib.request
import json

test_prompts = [
    ("1. Greeting 'hi'", "hi", None),
    ("2. Greeting 'hello'", "hello", None),
    ("3. Small Talk 'how are you?'", "how are you?", None),
    ("4. Capability 'what can you do?'", "what can you do?", None),
    ("5. Financial 'what is SIP?'", "what is SIP?", None),
    ("6. Follow-up 'explain more'", "explain more", [{"role": "user", "content": "what is SIP?"}, {"role": "assistant", "content": "A Systematic Investment Plan allows retail investors..."}]),
    ("7. Live Market 'today's gold price'", "today's gold price", None),
    ("8. Personal Unauth 'how much did I spend this month?'", "how much did I spend this month?", None),
]

print("=== FINBUD CHATBOT ENDPOINT TEST RESULTS ===")
for label, query, history in test_prompts:
    payload = {"query": query}
    if history:
        payload["conversation_history"] = history
    
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/v1/rag/ask",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"\n[TEST] {label}")
            print(f"  Query: \"{query}\"")
            print(f"  Model: {data.get('model')}")
            print(f"  Citations: {len(data.get('citations', []))}")
            first_sentence = data.get("answer", "").split("\n")[0]
            print(f"  Response: {first_sentence[:100]}...")
    except Exception as e:
        print(f"\n[FAIL] {label}: {e}")

