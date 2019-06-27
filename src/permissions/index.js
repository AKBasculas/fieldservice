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
  BRANCH: {
    CREATE: "branch.create"
  },
}
const ROLES = {
    PERMISSIONS.BRANCH.CREATE,
}
const permissions = {permit, PERMISSIONS, ROLES};
export default permissions;
