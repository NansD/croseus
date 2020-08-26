import React, { useEffect, useState } from 'react';
import { useAsync } from 'react-async';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import useUserState from '../../hooks/useUserState';
import NAVIGATION from '../../navigation.json';
import ExpenseService from '../../services/expense.service';
import GroupService from '../../services/group.service';
import Loading from '../Loading/Loading';
import PullToRefresh from '../PullToRefresh/PullToRefresh';
import ExpenseItem from './ExpenseItem/ExpenseItem';
import ExpenseItemForm from './ExpenseItem/ExpenseItemForm';

function checkUserGroups(user, history) {
  if (!user) {
    return;
  }
  if (user && (!user.groups.length || !user.favoriteGroup)) {
    history.push(NAVIGATION.GROUPS);
    toast.info(
      <>
        <p>
          Vous n'avez pas encore de groupe. Voici la page qui permet d'en créer un !
        </p>
        <p>
          Pour commencer, cliquez sur "Créer un groupe".
        </p>
      </>,
      { toastId: user._id },
    );
  }
}

export default function ExpenseList() {
  const [user] = useUserState();
  const [group, setGroup] = useState();
  const history = useHistory();
  const participants = (group && group.participants) || [];

  const setExpenses = (expenses) => {
    setGroup({ ...group, expenses });
  };

  useEffect(() => {
    checkUserGroups(user, history);
  }, [user]);

  ExpenseService.setGroup(user && user.favoriteGroup);
  function notifyGetAllError(error) {
    toast.error(`Erreur d'obtention des dépenses: ${error}`);
    console.log('error :', error);
  }

  const { isPending: loading, reload } = useAsync({
    promiseFn: GroupService.getOne,
    _id: user && user.favoriteGroup,
    onReject: notifyGetAllError,
    onResolve: (r) => setGroup(r.document),
  });

  const deleteExpense = (id) => {
    setExpenses(group.expenses.filter((e) => e._id !== id));
  };

  const createExpense = (e) => {
    setExpenses([e, ...group.expenses]);
  };

  if (!group && loading) {
    return (
      <Loading />
    );
  }

  return (
    <PullToRefresh onRefresh={() => reload()}>
      {loading && (
        <Loading />
      )}
      <div className="hero has-background-white mb-5">
        <div className="hero-body">
          <h3 className="title is-3">
            { group && group.name }
          </h3>
          <h4 className="subtitle is-4">
            Participants :
            { group
            && group.participants && group.participants.map((p) => <div key={p._id}>{p.name}</div>)}
          </h4>
        </div>
      </div>
      <ExpenseItemForm createExpense={createExpense} participants={participants} />
      {group && group.expenses
      && group.expenses.map((expense) => (
        <ExpenseItem
          key={expense._id}
          expense={expense}
          deleteExpense={deleteExpense}
        />
      ))}
    </PullToRefresh>
  );
}
