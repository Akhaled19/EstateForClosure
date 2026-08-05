from dataclasses import dataclass

@dataclass
class StubUser: 
    id: str = "3a7433f0-0707-4e2f-b005-807304895c8d"


def get_current_user() -> StubUser:
    return StubUser()
