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

export function EmailForm({ currentEmail, isExternalProvider }: EmailFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newEmail, setNewEmail] = useState(currentEmail);


  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail === currentEmail) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      const validatedEmail = emailSchema.parse({ email: newEmail });
      await authClient.changeEmail({newEmail:validatedEmail.email,callbackURL:"/dashboard"});
      toast.success('Email update request sent. Please check your new email for verification.');
      setIsEditing(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error('Invalid email address');
      } else {
        toast.error('Failed to update email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isExternalProvider) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Email:</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">(Managed by external provider)</span>
          <span className="font-medium">{currentEmail}</span>
        </div>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Email:</span>
        <div className="flex items-center gap-2">
          <span className="font-medium">{currentEmail}</span>
          <Button
            onClick={() => setIsEditing(true)}
            className="h-8 w-8"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
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
        className="h-8 w-8"
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
          setNewEmail(currentEmail);
        }}
        className="h-8 w-8 bg-red-500 hover:bg-red-600"
      >
        <X className="h-4 w-4" />
      </Button>
    </form>
  );
} 