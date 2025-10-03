// Server API methods.
// POST
// validate_and_insert ::returns { id, errors }
// - folder & upload API: SQLFORM ::returns(forced) { id, errors }
// - auth API: login_bare, add_membership
// PUT
// validate_and_update ::returns { updated*, errors })  *number of updated records
// DELETE
// delete ::returns number of deleted records
// - auth API: logout_bare, del_membership

export default function () {
  function DELETE(result, accepted, errors) {
    if (Number.isInteger(result)) {
      if (typeof accepted === 'function') accepted(result)
    } else {
      if (typeof errors === 'function') errors()
    }
  }
  function POST(result, accepted, errors) {
    if (typeof result === 'object') {
      if (result.id) {
        if (typeof accepted === 'function') accepted(result.id)
      } else {
        if (typeof errors === 'function') errors(result.errors)
      }
    }
  }
  function PUT(result, accepted, errors) {
    if (typeof result === 'object') {
      if (!Object.keys(result.errors).length) {
        if (typeof accepted === 'function') accepted(result.updated)
      } else {
        if (typeof errors === 'function') errors(result.errors)
      }
    }
  }
  return {
    DELETE,
    POST,
    PUT
  }
}
