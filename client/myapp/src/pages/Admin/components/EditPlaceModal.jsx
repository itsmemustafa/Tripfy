import React, { useState, useEffect } from 'react';
import { uploadPlaceImage } from '../../../api/admin';
import './AdminModals.css';

const EditPlaceModal = ({ isOpen, onClose, onSave, place }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        subcategory: '',
        description: '',
        city: '',
        lat: '',
        lng: '',
        rating: '',
        images: ['']
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (place) {
            setFormData({
                name: place.name || '',
                category: place.category || '',
                subcategory: place.subcategory || '',
                description: place.description || '',
                city: place.location?.city || '',
                lat: place.location?.coordinates?.lat || '',
                lng: place.location?.coordinates?.lng || '',
                rating: place.rating !== undefined ? place.rating : '',
                images: place.images && place.images.length > 0 ? place.images : ['']
            });
        }
    }, [place]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    };

    const removeImageField = (index) => {
        if (formData.images.length > 1) {
            const newImages = formData.images.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, images: newImages }));
        }
    };

    const handleFileUpload = async (index, file) => {
        if (!file) return;
        try {
            setLoading(true);
            const data = await uploadPlaceImage(file);
            if (data.url) {
                handleImageChange(index, data.url);
            }
        } catch (err) {
            setError('Failed to upload image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const placePayload = {
            name: formData.name,
            category: formData.category,
            subcategory: formData.subcategory,
            description: formData.description,
            location: {
                city: formData.city,
                coordinates: {
                    lat: parseFloat(formData.lat),
                    lng: parseFloat(formData.lng)
                }
            },
            rating: formData.rating !== '' ? parseFloat(formData.rating) : 0,
            images: formData.images.filter(url => url.trim() !== '')
        };

        try {
            await onSave(place._id, placePayload);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-large">
                <h2>Edit Place</h2>
                {error && <p className="modal-error">{error}</p>}
                <form onSubmit={handleSubmit} className="modal-form-grid">
                    <div className="form-group full-width">
                        <label>Place Name *</label>
                        <input name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Category *</label>
                        <select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">Select Category</option>
                            <option value="Nature">Nature</option>
                            <option value="Historical">Historical</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Cafe">Cafe</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Religious">Religious</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Subcategory</label>
                        <input name="subcategory" value={formData.subcategory} onChange={handleChange} placeholder="e.g. Park, Museum" />
                    </div>

                    <div className="form-group">
                        <label>City *</label>
                        <input name="city" value={formData.city} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Rating</label>
                        <input
                            type="number"
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            min="0"
                            max="5"
                            step="0.1"
                            placeholder="0-5"
                        />
                    </div>

                    <div className="form-group coordinates-group full-width">
                        <label>Coordinates *</label>
                        <div className="row">
                            <input type="number" step="any" name="lat" placeholder="Latitude" value={formData.lat} onChange={handleChange} required />
                            <input type="number" step="any" name="lng" placeholder="Longitude" value={formData.lng} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
                    </div>

                    <div className="form-group full-width">
                        <label>Images (Upload or URLs)</label>
                        {formData.images.map((url, index) => (
                            <div key={index} className="image-input-row" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={url}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(index, e.target.files[0])}
                                    style={{ width: '200px' }}
                                />
                                {formData.images.length > 1 && (
                                    <button type="button" className="btn-remove-small" onClick={() => removeImageField(index)}>Remove</button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="btn-text-only" onClick={addImageField}>+ Add another image</button>
                    </div>

                    <div className="modal-actions full-width">
                        <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPlaceModal;
