import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = FolderOpen, 
  title = "No data found", 
  description = "There are no records to display at the moment.",
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl bg-muted/20 border-muted mt-4">
      <div className="bg-muted p-4 rounded-full mb-4">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-xs mb-6">
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
