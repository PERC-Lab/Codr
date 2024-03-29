import { AccessControl, IQueryInfo } from "role-acl";

const grantsObject = {
  grants: {
    user: {
      score: 1,
      grants: [
        { resource: ["organization"], action: ["read"], attributes: ["*"] },
        { resource: ["organization"], action: ["create"], attributes: ["*"] },
        { resource: ["project"], action: ["read"], attributes: ["*"] },
        { resource: ["annotation"], action: ["read"], attributes: ["*"] },
      ],
    },
    researcher: {
      score: 2,
      $extend: { user: {} },
      grants: [
        { resource: ["project"], action: ["create"], attributes: ["*"] },
        {
          resource: ["project"],
          action: ["update"],
          attributes: ["*"],
          condition: { Fn: "EQUALS", args: { userId: "$.ownerId" } },
        },
      ],
    },
    admin: {
      score: 1,
      grants: [
        { resource: ["organization"], action: ["*"], attributes: ["*"] },
        { resource: ["project"], action: ["*"], attributes: ["*"] },
        { resource: ["annotation"], action: ["*"], attributes: ["*"] },
      ],
    },
  },
  customConditionFunctions: {},
};

const AccessControlManager = class {
  enabled = false;

  /**
   *
   * @param {Object} [param0]
   * @param {{ [x: string]: any }} [param0.grants]
   * @param {Boolean} [param0.enabled]
   */
  constructor({ grants, enabled } = {}) {
    const ac = new AccessControl(grants);
    this.ac = ac;
    this.roles = Object.freeze(["user", "researcher", "admin"]);

    this.enabled = enabled || false;

    /**
     * @type {string}
     */
    this.activeRole = undefined;
  }

  /**
   * @param {string | string[] | IQueryInfo} role
   * Gets an instance of Query object. This is used to check whether the defined access is allowed for the given role(s) and resource. This object provides chainable methods to define and query the access permissions to be checked.
   * @name AccessControl#can
   * @alias AccessControl#access
   * @function
   * @chainable
   * @param role A single role (as a string), a list of roles (as an array) or an {@link ?api=ac#AccessControl~IQueryInfo|IQueryInfo object} that fully or partially defines the access to be checked.
   * @returns
   */
  can(role) {
    if (this.enabled) return this.ac.can(role);
    else return true;
  }

  canUser() {
    if (this.enabled) return this.ac.can(this.activeRole);
    else return true;
  }

  getACL() {
    return this.ac;
  }

  setRole(role) {
    this.activeRole = role;
  }
};

export default AccessControlManager;
export const GlobalACL = new AccessControlManager({
  grants: grantsObject?.grants,
  enabled: true,
});

/*

Resources: 
  Organization:
    actions:
      create,
      update,
      delete
    attributes:
      members,
      permission
  Project:
    actions:
      create,
      update,
      delete
    attributes:
      datasets,
      settings,
      guidelines
  Annotation:
    actions:
      create,
      update,
      delete
    attributes:
      ...

*/
