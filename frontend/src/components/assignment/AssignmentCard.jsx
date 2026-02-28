import React from 'react';
import { useNavigate } from 'react-router-dom';

const AssignmentCard = ({ assignment }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/assignment/${assignment.id}`);
  };

  const getBadgeClass = (difficulty) => {
    return `assignment-card__badge assignment-card__badge--${difficulty.toLowerCase()}`;
  };

  return (
    <div className="assignment-card" onClick={handleClick}>
      <div className="assignment-card__header">
        <h3 className="assignment-card__title">{assignment.title}</h3>
        <span className={getBadgeClass(assignment.difficulty)}>
          {assignment.difficulty}
        </span>
      </div>
      <p className="assignment-card__description">{assignment.description}</p>
      <div className="assignment-card__question">
        <strong>Question:</strong> {assignment.question}
      </div>
    </div>
  );
};

export default AssignmentCard;
