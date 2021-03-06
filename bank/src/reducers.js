import { SET_ACCOUNT, DEPOSIT, WITHDRAWAL, TRANSFER, FILTER, CLEAR_FILTERED } from './actions'

let transactionId = 1

export function bank(state = {}, action) {
  let accounts = [...state.accounts]
  let account = accounts.filter((account) => {
    return account.id === state.activeAccount
  })[0]

  switch (action.type) {
    case SET_ACCOUNT:
      return {
        ...state,
        activeAccount: action.data,
      }
    case DEPOSIT:
    case WITHDRAWAL:
      account.balance += action.data
      account.transactions.push(addTransaction(state, action))
      return {
        ...state,
        accounts: accounts,
      }

    case TRANSFER:
      let transferer = accounts.filter((account) => {
        return account.id === state.activeAccount
      })
      let recipient = accounts.filter((account) => {
        return account.id === action.data.to
      })
      recipient[0].balance += action.data.amount
      recipient[0].transactions.push(addTransaction(state, action))
      transferer[0].balance -= action.data.amount
      transferer[0].transactions.push(addTransaction(state, action, -1))
      return {
        ...state,
        accounts: accounts,
      }

    case FILTER:
    
      return {
        ...state,
        filterDates: {start: action.data.start, end: action.data.end}
      }

      case CLEAR_FILTERED:
      return {
        ...state,
        filterDates: {start: null, end: null}
      }

    default:
      return state
  }
}

function addTransaction(state, action, sign) {
  sign = sign || 1
  return {
    id: transactionId++,
    type: action.type,
    amount: isNaN(action.data) ? action.data.amount : action.data,
    date: new Date(),
    mainAccount: state.activeAccount,
    associatedAccount: action.data.to
  }
}
