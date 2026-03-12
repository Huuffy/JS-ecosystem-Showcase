function ShareDialog() {
    const { documentId } = window.useDocument();
    const [shareUrl] = React.useState(`${window.location.origin}/doc/${documentId}`);
    const [permissions, setPermissions] = React.useState('edit');
    const [emailToShare, setEmailToShare] = React.useState('');
    const [sharedUsers, setSharedUsers] = React.useState([
        { email: 'john@example.com', permission: 'edit', status: 'active' },
        { email: 'jane@example.com', permission: 'comment', status: 'pending' }
    ]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Link copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link copied to clipboard!');
        });
    };

    const handlePermissionChange = React.useCallback((newPermission) => {
        setPermissions(newPermission);
        console.log('Permissions updated to:', newPermission);
    }, []);

    const shareViaEmail = React.useCallback(() => {
        if (emailToShare.trim()) {
            const newUser = {
                email: emailToShare,
                permission: permissions,
                status: 'pending'
            };
            
            setSharedUsers(prev => [...prev, newUser]);
            setEmailToShare('');
            
            alert(`Document shared with ${emailToShare} with ${permissions} permissions`);
        }
    }, [emailToShare, permissions]);

    const removeUser = (email) => {
        setSharedUsers(prev => prev.filter(user => user.email !== email));
    };

    const updateUserPermission = (email, newPermission) => {
        setSharedUsers(prev => 
            prev.map(user => 
                user.email === email ? { ...user, permission: newPermission } : user
            )
        );
    };

    return React.createElement('div', { className: 'share-dialog' },
        React.createElement('h3', null, 'Share Document'),
        
        React.createElement('div', { className: 'share-section' },
            React.createElement('h4', null, 'Share via link'),
            React.createElement('div', { className: 'share-url' },
                React.createElement('input', {
                    type: 'text',
                    value: shareUrl,
                    readOnly: true,
                    className: 'share-input'
                }),
                React.createElement('button', {
                    onClick: copyToClipboard,
                    className: 'copy-btn'
                }, 'Copy')
            ),
            React.createElement('div', { className: 'permissions' },
                React.createElement('label', null, 'Default permissions:'),
                React.createElement('select', {
                    value: permissions,
                    onChange: (e) => handlePermissionChange(e.target.value),
                    className: 'permissions-select'
                },
                    React.createElement('option', { value: 'view' }, 'View Only'),
                    React.createElement('option', { value: 'comment' }, 'Can Comment'),
                    React.createElement('option', { value: 'edit' }, 'Can Edit')
                )
            )
        ),

        React.createElement('div', { className: 'share-section' },
            React.createElement('h4', null, 'Invite people'),
            React.createElement('div', { className: 'email-share' },
                React.createElement('input', {
                    type: 'email',
                    value: emailToShare,
                    onChange: (e) => setEmailToShare(e.target.value),
                    placeholder: 'Enter email address',
                    className: 'email-input'
                }),
                React.createElement('button', {
                    onClick: shareViaEmail,
                    className: 'invite-btn',
                    disabled: !emailToShare.trim()
                }, 'Invite')
            )
        ),

        React.createElement('div', { className: 'share-section' },
            React.createElement('h4', null, `Shared with (${sharedUsers.length})`),
            React.createElement('div', { className: 'shared-users' },
                sharedUsers.map(user =>
                    React.createElement('div', {
                        key: user.email,
                        className: 'shared-user'
                    },
                        React.createElement('div', { className: 'user-info' },
                            React.createElement('span', { className: 'user-email' }, user.email),
                            React.createElement('span', { 
                                className: `user-status ${user.status}` 
                            }, user.status)
                        ),
                        React.createElement('select', {
                            value: user.permission,
                            onChange: (e) => updateUserPermission(user.email, e.target.value),
                            className: 'user-permission'
                        },
                            React.createElement('option', { value: 'view' }, 'View'),
                            React.createElement('option', { value: 'comment' }, 'Comment'),
                            React.createElement('option', { value: 'edit' }, 'Edit')
                        ),
                        React.createElement('button', {
                            onClick: () => removeUser(user.email),
                            className: 'remove-user-btn',
                            title: 'Remove access'
                        }, '×')
                    )
                )
            )
        )
    );
}

window.ShareDialog = ShareDialog;
