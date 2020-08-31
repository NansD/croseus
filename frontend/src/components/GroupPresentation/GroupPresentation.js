import React from 'react';

export default function GroupPresentation({ group }) {
  return (
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
  );
}