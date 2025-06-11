'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Loader2, PencilIcon, CheckIcon, X } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

interface EmailFormProps {
  currentEmail: string;
  isExternalProvider: boolean;
}

export function EmailForm({ currentEmail: initialEmail, isExternalProvider }: EmailFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newEmail, setNewEmail] = useState(initialEmail);
  const [displayEmail, setDisplayEmail] = useState(initialEmail);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail === displayEmail) {
      setIsEditing(false);
      return;
    }

    const validatedEmail = emailSchema.safeParse({ email: newEmail });
    if (!validatedEmail.success) {
      toast.error(`Error : ${validatedEmail.error.flatten().fieldErrors}`);
      return;
    }
    setIsLoading(true);

    const result = await authClient.changeEmail({newEmail});
    setIsLoading(false);
    if (result.error) {
      toast.error(`Invalid email address: ${result.error.message}`);
      return;
    }
    toast.success('Email update request sent. Please check your new email for verification.');
    setDisplayEmail(newEmail);
    setIsEditing(false);


  };

  if (isExternalProvider) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Email:</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">(Managed by external provider)</span>
          <span className="font-medium">{displayEmail}</span>
        </div>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Email:</span>
        <div className="flex items-center gap-2">
          <span className="font-medium">{displayEmail}</span>
          <PencilIcon
            onClick={() => setIsEditing(true)}
            className="h-4 w-4 cursor-pointer text-gray-600 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
            role="button"
            tabIndex={0}
            aria-label="Edit email"
          />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleEmailUpdate} className="flex items-center gap-2">
      <input
        type="email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="h-8 w-8 flex items-center justify-center"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckIcon className="h-4 w-4" />
        )}
      </Button>
      <Button
        type="button"
        onClick={() => {
          setIsEditing(false);
          setNewEmail(displayEmail);
        }}
        className="h-8 w-8 bg-red-500 hover:bg-red-600 flex items-center justify-center"
      >
        <X className="h-4 w-4" />
      </Button>
    </form>
  );
} 