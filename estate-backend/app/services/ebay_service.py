import logging
import httpx
import base64
import json


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

async def get_ebay_application_token():
    credentials = f"{settings.EBAY_APP_ID}:{settings.EBAY_CERT_ID}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    headers = {
        "Authorization": f"Basic {encoded_credentials}",
        "Content-Type": "application/x-www-form-urlencoded",
    }

    data = {
        "grant_type": "client_credentials",
        "scope": "https://api.ebay.com/oauth/api_scope",
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(f"{EBAY_API_URL}/identity/v1/oauth2/token", headers=headers, data=data)

    if response.status_code != 200:
        raise Exception(f"Failed to get eBay application token: {response.text}")

    token_data = response.json()

    return token_data["access_token"]



async def create_inventory_item(
        item_id: str, 
        title: str, 
        description: str,
        aspects: dict,
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
            "aspects": aspects
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
            "paymentPolicyId": settings.EBAY_PAYMENT_POLICY_ID,
            "fulfillmentPolicyId": settings.EBAY_FULFILLMENT_POLICY_ID,
            "returnPolicyId": settings.EBAY_RETURN_POLICY_ID
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
            "paymentPolicyId": settings.EBAY_PAYMENT_POLICY_ID,
            "fulfillmentPolicyId": settings.EBAY_FULFILLMENT_POLICY_ID,
            "returnPolicyId": settings.EBAY_RETURN_POLICY_ID
        }
    }

    async with httpx.AsyncClient() as client:
        response = await client.put(url, headers=headers, json=data)


    return response.status_code, response.text

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


async def get_category_suggestions(query: str):
    access_token = await get_ebay_application_token()

    url = f"{EBAY_API_URL}/commerce/taxonomy/v1/"f"category_tree/0/get_category_suggestions"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Content-Language": "en-US",
    }

    params = {"q": query}

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url, headers=headers, params=params)

    return response.status_code, response.text



async def get_item_aspects_for_category(category_id: str):
    access_token = await get_ebay_application_token()

    url = f"{EBAY_API_URL}/commerce/taxonomy/v1/"f"category_tree/0/get_item_aspects_for_category"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Accept-Language": "en-US",
    }

    params = {"category_id": category_id}
    

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(url, headers=headers, params=params)

    return response.status_code, response.text




async def get_category_aspects(category_id: str):
    status_code, response = await get_item_aspects_for_category(category_id)

    if status_code != 200:
        return status_code, response

    data = json.loads(response)

    aspects = []

    for aspect in data.get("aspects", []):
        constraint = aspect.get("aspectConstraint", {})

        aspects.append({
            "name": aspect.get("localizedAspectName"),
            "required": constraint.get("aspectRequired", False),
            "usage": constraint.get("aspectUsage"),
            "dataType": constraint.get("aspectDataType"),
            "cardinality": constraint.get("itemToAspectCardinality"),
            "mode": constraint.get("aspectMode"),
            "variation": constraint.get("aspectEnabledForVariations", False),
            "applicableTo": constraint.get("aspectApplicableTo", []),
            "values": [
                value.get("localizedValue") for value in aspect.get("aspectValues", [])
            ]

        })

    return 200, aspects


async def get_required_category_aspects(category_id: str):
    status_code, aspects = await get_category_aspects(category_id)

    if status_code != 200:
        return status_code, aspects

    required_aspects = [aspect for aspect in aspects if aspect.get("required") is True]

    return 200, required_aspects

async def find_ebay_category(title: str, category: str | None = None):
    query = title

    if category:
        query = f"{category} {title}"

    status_code, response = await get_category_suggestions(query)


    if status_code != 200:
        return status_code, response

    data = json.loads(response)
    suggestions = data.get("categorySuggestions", [])

    if not suggestions:
        return 404, "No eBay category suggestions found"

    best_category = suggestions[0]["category"]

    return 200, {
        "category_id": best_category["categoryId"],
        "category_name": best_category["categoryName"],
    }

async def get_ebay_category_and_aspects(title: str, category: str | None = None):
    # find category
    status_code, category_result = await find_ebay_category(title=title, category=category)

    if status_code != 200:
        return status_code, category_result

    category_id = category_result["category_id"]

    # get the required aspects for that category
    status_code, aspects = await get_required_category_aspects(category_id)

    if status_code != 200:
        return status_code, aspects

    return 200, {
        "category_id": category_id,
        "category_name": category_result["category_name"],
        "required_aspects": aspects,
    }

# parse dimensions
def parse_dimensions(dimensions: str | None):
    if not dimensions:
        return {}

    parts = [part.strip() for part in dimensions.lower().split("x")]

    if len(parts) != 3:
        return {}

    length, width, height = parts
    length = length.replace("inches", "").replace("inch", "").replace("in", "").strip() 
    width = width.replace("inches", "").replace("inch", "").replace("in", "").strip() 
    height = height.replace("inches", "").replace("inch", "").replace("in", "").strip()

    return {
        "Item Length": [f"{length} in"],
        "Item Width": [f"{width} in"],
        "Item Height": [f"{height} in"],
    }


def get_missing_required_aspects(required_aspects: list, available_aspects: dict):
    missing_aspects = []

    for aspect in required_aspects:
        name = aspect["name"]

        if name not in available_aspects:
            missing_aspects.append(aspect)

    return missing_aspects


async def get_item_ebay_requirements(
    title: str,
    category: str | None,
    brand: str | None,
    dimensions: str | None,
):
    # find ebay category and required aspects
    status_code, category_result = await get_ebay_category_and_aspects(title=title, category=category)

    if status_code != 200:
        return status_code, category_result

    category_id = category_result["category_id"]
    category_name = category_result["category_name"]
    required_aspects = category_result["required_aspects"]

    # build aspects that we already know 
    dimensions_aspects = parse_dimensions(dimensions)

    aspects = {}

    for aspect in required_aspects:
        name = aspect["name"]

        if name == "Brand":
            aspects[name] = [brand or "Unbranded"]

        elif name in dimensions_aspects:
            aspects[name] = dimensions_aspects[name]

    # find missing aspects
    missing_aspects = get_missing_required_aspects(required_aspects=required_aspects, available_aspects=aspects)

    return 200, {
        "category_id": category_id,
        "category_name": category_name,
        "required_aspects": required_aspects,
        "known_aspects": aspects,
        "missing_aspects": missing_aspects,
    }