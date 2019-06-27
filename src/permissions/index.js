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
  USER: {
    CREATE: "user.create"
  },
  BRANCH: {
    CREATE: "branch.create"
  },
  SERVICE: {
    CREATE: "service.create"
  },
  COMPANY: {
    CREATE: "company.create"
  },
  DEVICE: {
    TYPE: "device.type.create",
    BRAND: "device.brand.create",
    MODEL: "device.model.create"
  },
  OWNERSHIP: {
    CREATE: "ownership.create"
  },
  PERSON: {
    CREATE: "person.create"
  },
}
const ROLES = {
  ADMIN: [
    PERMISSIONS.USER.CREATE,
    PERMISSIONS.BRANCH.CREATE,
    PERMISSIONS.SERVICE.CREATE,
    PERMISSIONS.COMPANY.CREATE,
    PERMISSIONS.DEVICE.TYPE,
    PERMISSIONS.DEVICE.BRAND,
    PERMISSIONS.DEVICE.MODEL,
    PERMISSIONS.OWNERSHIP.CREATE,
    PERMISSIONS.PERSON.CREATE,
  ],
  COMMON: [
    PERMISSIONS.COMPANY.CREATE,
    PERMISSIONS.DEVICE.TYPE.CREATE,
    PERMISSIONS.DEVICE.BRAND.CREATE,
    PERMISSIONS.DEVICE.MODEL.CREATE
  ]
}

const permissions = {permit, PERMISSIONS, ROLES};

export default permissions;
