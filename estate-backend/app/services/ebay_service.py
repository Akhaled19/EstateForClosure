import logging
import httpx
import base64


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


async def exchange_ebay_code(code: str):
    url = "https://api.sandbox.ebay.com/identity/v1/oauth2/token"

    credentials = f"{settings.EBAY_APP_ID}:{settings.EBAY_CERT_ID}"

    encoded_credentials = base64.b64encode(
        credentials.encode()
    ).decode()

    headers = {
        "Authorization": f"Basic {encoded_credentials}",
        "Content-Type": "application/x-www-form-urlencoded",
    }

    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.EBAY_RU_NAME,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            url,
            headers=headers,
            data=data,
        )

    if response.status_code != 200:
        raise Exception(
            f"Failed to get eBay tokens: {response.text}"
        )

    return response.json()


async def refresh_ebay_access_token():
    url = "https://api.sandbox.ebay.com/identity/v1/oauth2/token"

    credentials = f"{settings.EBAY_APP_ID}:{settings.EBAY_CERT_ID}"
    encoded_credentials = base64.b64encode(
        credentials.encode()
    ).decode()

    headers = {
        "Authorization": f"Basic {encoded_credentials}",
        "Content-Type": "application/x-www-form-urlencoded",
    }

    data = {
        "grant_type": "refresh_token",
        "refresh_token": settings.EBAY_REFRESH_TOKEN,
        "scope": EBAY_SCOPE,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            url,
            headers=headers,
            data=data,
        )

    if response.status_code != 200:
        raise Exception(
            f"Failed to refresh eBay access token: {response.text}"
        )

    token_data = response.json()

    return token_data["access_token"]



async def create_inventory_item(
        item_id: str, 
        title: str, 
        description: str,
        brand: str | None,
        condition: str | None,
    ):

    access_token = await refresh_ebay_access_token()

    url = f"{EBAY_API_URL}/sell/inventory/v1/inventory_item/{item_id}"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Content-Language": "en-US",
    }

    data = {
        "product": {
            "title": title,
            "description": description,
            "imageUrls": [
                "https://fvkypuuhumnjzaevsxxk.supabase.co/storage/v1/object/sign/test/chair-image.jpg?token=eyJraWQiOiJkMjM2MGMyMy1iMmRmLTRjMzUtYmViZi1hMjVlNGI1ODYwYTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0ZXN0L2NoYWlyLWltYWdlLmpwZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODc5MzExOTMsImV4cCI6MTgxOTQ2NzE5M30.QiyzktIOthWbAt7RYND8eZZR0FsBgzYS8fIVDbIofS4"
            ],
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
                "quantity": 1,
                "merchantLocationKey": "test-location",
                "allocationByFormat": {
                    "fixedPrice": 1
                }
            }
        }
    }



    async with httpx.AsyncClient(timeout = 30.0) as client:
        response = await client.put(url, headers=headers, json=data)


    return response.status_code, response.text


async def create_inventory_location():
    location_key = "test-location"
    access_token = await refresh_ebay_access_token()

    url = f"{EBAY_API_URL}/sell/inventory/v1/location/{location_key}"

    headers = {
        "Authorization": f"Bearer {access_token}",
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
        "name": "Test Location",
        "merchantLocationStatus": "ENABLED"
    }




    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=data)


    return response.status_code, response.text


async def create_offer(item_id: str, price: float, category_id: str = "54235" ):
    access_token = await refresh_ebay_access_token()
    url = f"{EBAY_API_URL}/sell/inventory/v1/offer"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
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
    access_token = await refresh_ebay_access_token()
    url = f"{EBAY_API_URL}/sell/inventory/v1/offer"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Content-Language": "en-US",
    }

    params = {"sku": item_id, "marketplace_id": "EBAY_US"}

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url, headers=headers, params=params)

    return response.status_code, response.text


async def publish_offer(offer_id: str):
    access_token = await refresh_ebay_access_token()
    url = f"{EBAY_API_URL}/sell/inventory/v1/offer/{offer_id}/publish"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Content-Language": "en-US",
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, headers=headers, json={})



    return response.status_code, response.text


async def get_offer(offer_id: str):
    access_token = await refresh_ebay_access_token()
    url = f"{EBAY_API_URL}/sell/inventory/v1/offer/{offer_id}"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Content-Language": "en-US",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    return response.status_code, response.text

async def update_offer():
    access_token = await refresh_ebay_access_token()
    offer_id = "11488317010"

    url = f"{EBAY_API_URL}/sell/inventory/v1/offer/{offer_id}"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Content-Language": "en-US",
    }

    data = {
        "sku": "4",
        "marketplaceId": "EBAY_US",
        "format": "FIXED_PRICE",
        "availableQuantity": 1,
        "categoryId": "54235",
        "merchantLocationKey": "test-location",
        "listingDuration": "GTC",
        "pricingSummary": {
            "price": {
                "value": "25.00",
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
    access_token = await refresh_ebay_access_token()
    url = f"{EBAY_API_URL}/commerce/taxonomy/v1/category_tree/0"

    headers = {
        "Authorization": f"Bearer {access_token}",
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



async def delete_offer(offer_id: str):
    access_token = await refresh_ebay_access_token()

    url = f"{EBAY_API_URL}/sell/inventory/v1/offer/{offer_id}"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Language": "en-US",
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.delete(
            url,
            headers=headers
        )

    return response.status_code, response.text