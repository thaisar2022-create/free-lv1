import React from 'react';
import { QuizView, QuizViewProps } from './QuizView';

export interface QuizTabProps extends QuizViewProps {
  speechRate: number;
}

export const QuizTab: React.FC<QuizTabProps> = ({ speechRate }) => {
  return <QuizView speechRate={speechRate} />;
};

export { QuizView } from './QuizView';
export default QuizTab;
