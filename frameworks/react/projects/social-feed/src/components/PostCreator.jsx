const { useState, useRef } = React;

function PostCreator({ onCreatePost }) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim() && !image) return;

        onCreatePost({
            content: content.trim(),
            image: imagePreview
        });

        setContent('');
        setImage(null);
        setImagePreview(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
            setImage(file);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return React.createElement('div', { className: 'post-creator' },
        React.createElement('form', { onSubmit: handleSubmit },
            React.createElement('div', { className: 'input-container' },
                React.createElement('textarea', {
                    value: content,
                    onChange: (e) => setContent(e.target.value),
                    placeholder: "What's happening?",
                    className: 'post-input',
                    maxLength: 280,
                    rows: 3
                }),
                imagePreview && React.createElement('div', { className: 'image-preview' },
                    React.createElement('img', { src: imagePreview, alt: 'Preview' }),
                    React.createElement('button', {
                        type: 'button',
                        onClick: removeImage,
                        className: 'remove-image'
                    }, '×')
                )
            ),
            React.createElement('div', { className: 'post-actions' },
                React.createElement('div', { className: 'action-buttons' },
                    React.createElement('input', {
                        ref: fileInputRef,
                        type: 'file',
                        accept: 'image/*',
                        onChange: handleImageUpload,
                        style: { display: 'none' }
                    }),
                    React.createElement('button', {
                        type: 'button',
                        onClick: () => fileInputRef.current?.click(),
                        className: 'action-btn'
                    }, '📷'),
                    React.createElement('button', {
                        type: 'button',
                        className: 'action-btn'
                    }, '😊')
                ),
                React.createElement('button', {
                    type: 'submit',
                    disabled: !content.trim() && !image,
                    className: 'post-btn'
                }, 'Post')
            )
        )
    );
}

window.PostCreator = PostCreator;
