import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { updateUsername, updatePassword } from '@/store/auth-slice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Pencil, FileText, Type, Check, X, CornerUpLeft } from 'lucide-react';
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Profile() {
    const { user, isLoading } = useSelector((state: RootState) => state.auth);
    const { notes } = useSelector((state: RootState) => state.notes);
    const dispatch = useDispatch<AppDispatch>();
    const [username, setUsername] = useState(user?.userName || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [errors, setErrors] = useState({ username: '', password: '' });

    const isLocalAuth = user?.authProvider === 'local';

    // Calcola statistiche
    const notesCount = notes?.length || 0;
    const totalWords = notes?.reduce((total, note) => {
        if (note.content) {
            // Rimuove spazi e conta le parole
            const words = note.content.replace(/\s+/g, ' ').trim().split(' ');
            return total + (words[0] === '' ? 0 : words.length);
        }
        return total;
    }, 0) || 0;

    //console.log('Profile - user object:', user);
    //console.log('Profile - isLoading:', isLoading);

    // Se sta caricando, mostra loading
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Caricamento profilo...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p>Utente non trovato</p>
                </div>
            </div>
        );
    }

    const handleUpdateUsername = async () => {
        setErrors({ ...errors, username: '' });

        if (!username.trim()) {
            const errorMsg = 'The username is required.';
            setErrors({ ...errors, username: errorMsg });
            toast.error(errorMsg);
            return;
        }

        try {
            const result = await dispatch(updateUsername(username));
            if (updateUsername.fulfilled.match(result)) {
                setIsEditingUsername(false);
                toast.success('Username updated!');
            } else {
                const errorMessage = typeof result.payload === 'object' && result.payload && 'message' in result.payload
                    ? (result.payload as any).message
                    : 'Error updating username';
                setErrors({ ...errors, username: errorMessage });
                toast.error(errorMessage);
            }
        } catch (error) {
            const errorMsg = 'Error updating username';
            setErrors({ ...errors, username: errorMsg });
            toast.error(errorMsg);
        }
    };

    const handleCancelUsernameEdit = () => {
        setIsEditingUsername(false);
        setUsername(user?.userName || '');
        setErrors({ ...errors, username: '' });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleUpdateUsername();
        } else if (e.key === 'Escape') {
            handleCancelUsernameEdit();
        }
    };

    const handleUpdatePassword = async () => {
        setErrors({ ...errors, password: '' });

        if (!currentPassword || !newPassword || !confirmPassword) {
            const errorMsg = 'All password fields are required.';
            setErrors({ ...errors, password: errorMsg });
            toast.error(errorMsg);
            return;
        }

        if (newPassword !== confirmPassword) {
            const errorMsg = 'Passwords do not match.';
            setErrors({ ...errors, password: errorMsg });
            toast.error(errorMsg);
            return;
        }

        if (newPassword.length < 6) {
            const errorMsg = 'The password must be at least 6 characters long.';
            setErrors({ ...errors, password: errorMsg });
            toast.error(errorMsg);
            return;
        }

        try {
            const result = await dispatch(updatePassword({
                currentPassword,
                newPassword
            }));

            if (updatePassword.fulfilled.match(result)) {
                setIsPasswordDialogOpen(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                toast.success('Password updated successfully!');
            } else {
                const errorMessage = typeof result.payload === 'object' && result.payload && 'message' in result.payload
                    ? (result.payload as any).message
                    : 'Error updating password';
                setErrors({ ...errors, password: errorMessage });
                toast.error(errorMessage);
            }
        } catch (error) {
            const errorMsg = 'Error updating password';
            setErrors({ ...errors, password: errorMsg });
            toast.error(errorMsg);
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">User not found</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#fdfdfc]" style={{ fontFamily: 'var(--font-body)' }}>
            <header className="w-full flex justify-center">
                <div className="w-full max-w-[900px] flex items-center justify-between px-4 py-[90px]">
                    {/* Icone a sinistra */}
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 hover:text-[#2FCCC3] transition cursor-pointer" onClick={() => window.history.back()}>
                            <Tooltip>
                                <TooltipTrigger><CornerUpLeft className="h-6 w-6" /></TooltipTrigger>
                                <TooltipContent>
                                    <p>Return</p>
                                </TooltipContent>
                            </Tooltip>


                        </button>
                    </div>

                    
                </div>
            </header>

            {/* Contenuto centrato */}
            <div className="flex-1 flex items-center justify-center px-4 -mt-[90px]">
                <div className="w-full max-w-md">
                    {/* Avatar centrato in alto */}
                    <div className="text-center mb-8">
                        <Avatar className="w-24 h-24 mx-auto mb-6 border-4 border-white shadow-lg">
                            <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {user?.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
                            </AvatarFallback>
                        </Avatar>

                        {/* Nome utente con editing inline minimale */}
                        <div className="mb-2">
                            {isEditingUsername ? (
                                <div className="flex items-center justify-center">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        onBlur={handleCancelUsernameEdit}
                                        placeholder="Username"
                                        className="text-center text-2xl font-bold text-gray-800 bg-transparent border-none outline-none focus:ring-0 focus:border-none max-w-xs"
                                        style={{
                                            border: 'none',
                                            outline: 'none',
                                            boxShadow: 'none',
                                            background: 'transparent',
                                            fontFamily: 'var(--font-heading)'
                                        }}
                                        autoFocus
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <h1
                                        className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                                        onClick={() => isLocalAuth && setIsEditingUsername(true)}
                                        style={{ fontFamily: 'var(--font-heading)' }}
                                    >
                                        {user?.userName || 'Username not available'}
                                    </h1>
                                    {isLocalAuth && (
                                        <button
                                            onClick={() => setIsEditingUsername(true)}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            )}
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1 text-center" style={{ fontFamily: 'var(--font-body)' }}>{errors.username}</p>
                            )}
                        </div>

                        {/* Email */}
                        <p className="text-gray-600 text-lg mb-6" style={{ fontFamily: 'var(--font-body)' }}>{user?.email || 'Email not available'}</p>

                        {/* Statistiche */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="text-center">
                                <div className="p-6">
                                    <div className="flex justify-center mb-3">
                                        <FileText className="h-8 w-8 text-gray-800" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{notesCount}</div>
                                    <div className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'var(--font-body)' }}>Note</div>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="p-6">
                                    <div className="flex justify-center mb-3">
                                        <Type className="h-8 w-8 text-gray-800" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{totalWords}</div>
                                    <div className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'var(--font-body)' }}>Words</div>
                                </div>
                            </div>
                        </div>

                        {/* Cambia Password - solo per utenti locali */}
                        {isLocalAuth && (
                            <div className="p-6">

                                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full" style={{ fontFamily: 'var(--font-body)' }}>
                                            Change Password
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle style={{ fontFamily: 'var(--font-heading)' }}>Change Password</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 pt-4">
                                            <div>
                                                <Label htmlFor="current-password" style={{ fontFamily: 'var(--font-body)' }}>Current Password</Label>
                                                <Input
                                                    id="current-password"
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    placeholder="Password attuale"
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="new-password" style={{ fontFamily: 'var(--font-body)' }}>New Password</Label>
                                                <Input
                                                    id="new-password"
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Nuova password"
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="confirm-password" style={{ fontFamily: 'var(--font-body)' }}>Confirm Password</Label>
                                                <Input
                                                    id="confirm-password"
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Conferma nuova password"
                                                    className="mt-1"
                                                />
                                            </div>
                                            {errors.password && (
                                                <p className="text-red-500 text-sm" style={{ fontFamily: 'var(--font-body)' }}>{errors.password}</p>
                                            )}
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)} style={{ fontFamily: 'var(--font-body)' }}>
                                                    Annulla
                                                </Button>
                                                <Button onClick={handleUpdatePassword} disabled={isLoading} style={{ fontFamily: 'var(--font-body)' }} className="hover:border hover:border-black">
                                                    {isLoading ? 'Salvataggio...' : 'Salva'}
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}

                        {/* Messaggio per utenti Google */}
                        {!isLocalAuth && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <div className="text-center">
                                    <div className="flex justify-center mb-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-green-800 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Google Account</h3>
                                    <p className="text-sm text-green-700" style={{ fontFamily: 'var(--font-body)' }}>
                                        You have logged in via Google. Your account settings are managed by Google.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}