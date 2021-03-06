import React from 'react'

const OrganizationContext = React.createContext()

function OrganizationReducer(state, action) {
  switch (action.type) {
    case 'set': {
      return {...action.payload}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function OrganizationProvider({children}) {
  const [state, dispatch] = React.useReducer(OrganizationReducer, {Organization: null})
  return (
    <OrganizationContext.Provider value={[state, dispatch]}>
        {children}
    </OrganizationContext.Provider>
  )
}

function useOrganization() {
  const [state, setState] = React.useContext(OrganizationContext)
  if (state === undefined) {
    throw new Error('useOrganizationState must be used within a OrganizationProvider')
  }
  return [state, setState]
}

export {OrganizationProvider, useOrganization}
