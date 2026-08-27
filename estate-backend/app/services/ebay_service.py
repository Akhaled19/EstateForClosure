import logging
import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

EBAY_AUTH_URL = "https://auth.sandbox.ebay.com/oauth2/authorize"
EBAY_SCOPE = "https://api.ebay.com/oauth/api_scope/sell.inventory"
EBAY_API_URL = "https://api.sandbox.ebay.com"

def ebay_auth_url() -> str:
    return (
        f"{EBAY_AUTH_URL}"
        f"?client_id={settings.EBAY_APP_ID}"
        f"&response_type=code"
        f"&redirect_uri={settings.EBAY_RU_NAME}"
        f"&scope={EBAY_SCOPE}"
    )



async def create_inventory_item(
        item_id: str, 
        title: str, 
        description: str,
        brand: str | None,
        condition: str | None,
    ):

    url = f"{EBAY_API_URL}/sell/inventory/v1/inventory_item/{item_id}"

    headers = {
        "Authorization": f"Bearer {settings.EBAY_USER_TOKEN}",
        "Content-Type": "application/json",
        "Content-Language": "en-US",
    }

    data = {
        "product": {
            "title": title,
            "description": description,
            "aspects": {
                "Item Length": ["30 in"],
                "Item Height": ["31 in"],
                "Type": ["Other"],
                "Item Width": ["32 in"],
                "Brand" : [brand or "Unbranded"],
                "Color" : ["Brown"]

            }
        },
        "condition": "USED_EXCELLENT",
        "availability": {
            "shipToLocationAvailability": {
                "quantity": 1
            }
        }
    }



    async with httpx.AsyncClient(timeout = 30.0) as client:
        response = await client.put(url, headers=headers, json=data)


    return response.status_code, response.text


async def create_inventory_location():
    location_key = "test-location"
    url = f"{EBAY_API_URL}/sell/inventory/v1/location/{location_key}"

    headers = {
        "Authorization": f"Bearer {settings.EBAY_USER_TOKEN}",
        "Content-Type": "application/json",
        "Content-Language": "en-US",
    }

    data = {
        "location": {
            "address": {
                "postalCode": "02111",
                "country": "US"
            }
        },
        "name": "Test Location"
    }




    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=data)


    return response.status_code, response.text


async def create_offer(item_id: str, price: float, category_id: str = "54235" ):
    url = f"{EBAY_API_URL}/sell/inventory/v1/offer"

    headers = {
        "Authorization": f"Bearer {settings.EBAY_USER_TOKEN}",
        "Content-Type": "application/json",
        "Content-Language": "en-US",
    }

    data = {
        "sku": item_id,
        "marketplaceId": "EBAY_US",
        "format": "FIXED_PRICE",
        "availableQuantity": 1,
        "categoryId": category_id,
        "merchantLocationKey": "test-location",
        "pricingSummary": {
            "price": {
                "value": f"{price:.2f}",
                "currency": "USD"
            }
        },
        "listingPolicies": {
            "paymentPolicyId": "6245181000",
            "fulfillmentPolicyId": "6245182000",
            "returnPolicyId": "6245183000"
        }
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, headers=headers, json=data)


    return response.status_code, response.text


async def get_existing_offer(item_id: str):
    url = f"{EBAY_API_URL}/sell/inventory/v1/offer"

    headers = {
        "Authorization": f"Bearer {settings.EBAY_USER_TOKEN}",
        "Content-Type": "application/json",
        "Content-Language": "en-US",
    }

    params = {"sku": item_id, "marketplace_id": "EBAY_US"}

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url, headers=headers, params=params)

    return response.status_code, response.text


async def publish_offer(offer_id: str):
    url = f"{EBAY_API_URL}/sell/inventory/v1/offer/{offer_id}/publish"

    headers = {
        "Authorization": f"Bearer {settings.EBAY_USER_TOKEN}",
        "Content-Type": "application/json",
        "Content-Language": "en-US",
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, headers=headers)



    return response.status_code, response.text


async def get_offer(offer_id: str):
    url = f"{EBAY_API_URL}/sell/inventory/v1/offer/{offer_id}"

    headers = {
        "Authorization": f"Bearer {settings.EBAY_USER_TOKEN}",
        "Content-Type": "application/json",
        "Content-Language": "en-US",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    return response.status_code, response.text

async def update_offer():
    offer_id = "11461024010"

    url = f"{EBAY_API_URL}/sell/inventory/v1/offer/{offer_id}"

    headers = {
        "Authorization": f"Bearer {settings.EBAY_USER_TOKEN}",
        "Content-Type": "application/json",
        "Content-Language": "en-US",
    }

    data = {
        "sku": "test-001",
        "marketplaceId": "EBAY_US",
        "format": "FIXED_PRICE",
        "availableQuantity": 1,
        "categoryId": "54235",
        "merchantLocationKey": "test-location",
        "listingDuration": "GTC",
        "pricingSummary": {
            "price": {
                "value": "10.00",
                "currency": "USD"
            }
        },
        "listingPolicies": {
            "paymentPolicyId": "6245181000",
            "fulfillmentPolicyId": "6245182000",
            "returnPolicyId": "6245183000"
        }
    }

    async with httpx.AsyncClient() as client:
        response = await client.put(url, headers=headers, json=data)


    return response.status_code, response.text


# temp to find valid ebay categories...
async def find_categories(search_term: str):
    url = f"{EBAY_API_URL}/commerce/taxonomy/v1/category_tree/0"

    headers = {
        "Authorization": f"Bearer {settings.EBAY_USER_TOKEN}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    if response.status_code != 200:
        return response.status_code, response.text

    tree = response.json()
    matches = []

    def search(node):
        category_name = node.get("category", {}).get("categoryName", "")

        if search_term.lower() in category_name.lower():
            matches.append({
                "categoryId": node.get("category", {}).get("categoryId"),
                "categoryName": category_name,
                "leaf": node.get("leafCategoryTreeNode", False),
            })

        for child in node.get("childCategoryTreeNodes", []):
            search(child)

    search(tree.get("rootCategoryNode", {}))
    return 200, matches