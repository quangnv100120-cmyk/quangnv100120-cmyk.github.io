import json

def traverse(node, depth=0):
    indent = "  " * depth
    name = node.get("name", "Unknown")
    node_type = node.get("type", "Unknown")
    characters = node.get("characters", "")
    text_info = f" -> TEXT: '{characters}'" if characters else ""
    print(f"{indent}- [{node_type}] {name}{text_info}")
    
    for child in node.get("children", []):
        traverse(child, depth + 1)

try:
    with open("figma_node.json", "r") as f:
        data = json.load(f)
    nodes = data.get("nodes", {})
    if not nodes:
        print("No nodes found, API response might be an error:")
        print(data)
    for node_id, node_data in nodes.items():
        print(f"\nNode ID: {node_id}")
        traverse(node_data.get("document", {}))
except Exception as e:
    print("Error parsing:", e)
