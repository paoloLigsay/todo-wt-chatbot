from constants.scim import user_schema

class User:
    def __init__(self, resource):
        self.id = str(resource['id'])
        self.active = resource['active']
        self.userName = resource['userName']
        self.familyName = resource['familyName']
        self.middleName = resource['middleName']
        self.givenName = resource['givenName']
        self.email = resource['email']
        self.update(resource)

    def update(self, resource):
        if "email" in resource:
            self.email = resource["email"]
        for attribute in ["givenName", "middleName", "familyName"]:
            if attribute in resource:
                setattr(self, attribute, resource[attribute])

    def to_scim_resource(self):
        return {
            "schemas": [user_schema],
            "id": self.id,
            "userName": self.userName,
            "name": {
                "familyName": self.familyName,
                "givenName": self.givenName,
                "middleName": self.middleName,
            },
            "active": self.active,
            "emails": [{"value": self.email, "primary": True}],
            "meta": {"resourceType": "User"},
        }

    def to_scim_resource_filtered_by_id(self):
      return {
          "id": self.id,
          "userName": self.userName,
          "name": {
              "familyName": self.familyName,
              "givenName": self.givenName,
              "middleName": self.middleName,
          },
          "active": self.active,
          "emails": [{"value": self.email, "primary": True}],
          "meta": {"resourceType": "User"},
      }
