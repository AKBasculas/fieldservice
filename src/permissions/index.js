// middleware for doing role-based permissions
function permit(allowed) {
  const isAllowed = permissions => allowed.every( a => permissions.includes(a));

  // return a middleware
  return (req, res, next) => {
    if (req.user && isAllowed(ROLES[req.user.role]))
      next(); // role is allowed, so continue on the next middleware
    else {
      res.sendStatus(403); // user is forbidden
    }
  }
}

const PERMISSIONS = {
  CREATE_USER: "CREATE_USER",
  CREATE_BRANCH: "CREATE_BRANCH",
  CREATE_SERVICE: "CREATE_SERVICE",
  CREATE_CONTACT: "CREATE_CONTACT",
  CREATE_COMPANY: "CREATE_COMPANY",
  ADD_COMPANY_CONTACTS: "ADD_COMPANY_CONTACTS",
  CREATE_DEVICE_TYPE: "CREATE_DEVICE_TYPE",
  CREATE_DEVICE_BRAND: "CREATE_DEVICE_BRAND",
  CREATE_DEVICE_MODEL: "CREATE_DEVICE_MODEL",
  CREATE_OWNERSHIP: "CREATE_OWNERSHIP",
  CREATE_PERSON: "CREATE_PERSON",
  CREATE_VEHICLE: "CREATE_VEHICLE",
  CREATE_ENTRY: "CREATE_ENTRY"
}

const ROLES = {
  ADMIN: [
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.CREATE_BRANCH,
    PERMISSIONS.CREATE_SERVICE,
    PERMISSIONS.CREATE_COMPANY,
    PERMISSIONS.CREATE_CONTACT,
    PERMISSIONS.ADD_COMPANY_CONTACTS,
    PERMISSIONS.CREATE_DEVICE_TYPE,
    PERMISSIONS.CREATE_DEVICE_BRAND,
    PERMISSIONS.CREATE_DEVICE_MODEL,
    PERMISSIONS.CREATE_OWNERSHIP,
    PERMISSIONS.CREATE_PERSON,
    PERMISSIONS.CREATE_VEHICLE,
    PERMISSIONS.CREATE_ENTRY
  ],
  COMMON: [
    PERMISSIONS.CREATE_CONTACT,
    PERMISSIONS.CREATE_COMPANY,
    PERMISSIONS.ADD_COMPANY_CONTACTS,
    PERMISSIONS.CREATE_DEVICE_TYPE,
    PERMISSIONS.CREATE_DEVICE_BRAND,
    PERMISSIONS.CREATE_DEVICE_MODEL,
    PERMISSIONS.CREATE_ENTRY
  ]
}

const permissions = {permit, PERMISSIONS, ROLES};

export default permissions;
