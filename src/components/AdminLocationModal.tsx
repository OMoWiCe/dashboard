import { useState, useEffect } from "react";
import "../css/AdminLocationModal.css";
import type {
  LocationWithStatus,
  LocationCreateRequest,
  LocationUpdateRequest,
} from "../types/admin";
import { adminApi } from "../utils/adminApi";
import { useToast } from "../contexts/ToastContext";

interface AdminLocationModalProps {
  location: LocationWithStatus | null; // null means adding new location
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

const AdminLocationModal = ({
  location,
  onClose,
  onSaved,
  onDeleted,
}: AdminLocationModalProps) => {
  const isEditing = location !== null;
  const { showToast, showConfirmation } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
    googleMapsUrl: "",
    openingHours: "",
    parameters: {
      avgDevicesPerPerson: 1.5,
      avgSimsPerPerson: 1.2,
      wifiUsageRatio: 0.7,
      cellularUsageRatio: 0.3,
      updateInterval: 60,
    },
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when location changes
  useEffect(() => {
    if (location) {
      setFormData({
        id: location.locationId,
        name: location.name,
        address: location.address,
        googleMapsUrl: location.googleMapsUrl,
        openingHours: location.openingHours,
        parameters: {
          avgDevicesPerPerson: 1.5, // These would ideally come from the location's parameter API
          avgSimsPerPerson: 1.2,
          wifiUsageRatio: 0.7,
          cellularUsageRatio: 0.3,
          updateInterval: location.updateInterval,
        },
      });
    } else {
      // Reset form for new location
      setFormData({
        id: "",
        name: "",
        address: "",
        googleMapsUrl: "",
        openingHours: "",
        parameters: {
          avgDevicesPerPerson: 1.5,
          avgSimsPerPerson: 1.2,
          wifiUsageRatio: 0.7,
          cellularUsageRatio: 0.3,
          updateInterval: 60,
        },
      });
    }
  }, [location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [name]: parseFloat(value) || 0,
      },
    }));
  };

  const validateForm = () => {
    if (!isEditing && !formData.id.trim()) return "ID is required";
    if (!formData.name.trim()) return "Name is required";
    if (!formData.address.trim()) return "Address is required";
    if (!formData.googleMapsUrl.trim()) return "Google Maps URL is required";
    if (!formData.openingHours.trim()) return "Opening hours are required";

    // Validate parameters
    if (formData.parameters.avgDevicesPerPerson <= 0)
      return "Average devices per person must be greater than 0";
    if (formData.parameters.avgSimsPerPerson <= 0)
      return "Average SIMs per person must be greater than 0";
    if (
      formData.parameters.wifiUsageRatio < 0 ||
      formData.parameters.wifiUsageRatio > 1
    )
      return "WiFi usage ratio must be between 0 and 1";
    if (
      formData.parameters.cellularUsageRatio < 0 ||
      formData.parameters.cellularUsageRatio > 1
    )
      return "Cellular usage ratio must be between 0 and 1";
    if (formData.parameters.updateInterval <= 0)
      return "Update interval must be greater than 0";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing) {
        // Update existing location
        const updateData: LocationUpdateRequest = {
          name: formData.name,
          address: formData.address,
          googleMapsUrl: formData.googleMapsUrl,
          openingHours: formData.openingHours,
          parameters: formData.parameters,
        };

        await adminApi.updateLocation(formData.id, updateData);
        showToast(
          `Location "${formData.name}" successfully updated!`,
          "success"
        );
      } else {
        // Add new location
        const createData: LocationCreateRequest = {
          id: formData.id,
          name: formData.name,
          address: formData.address,
          googleMapsUrl: formData.googleMapsUrl,
          openingHours: formData.openingHours,
          parameters: formData.parameters,
        };

        await adminApi.addLocation(createData);
        showToast(`Location "${formData.name}" successfully added!`, "success");
      }

      onSaved();
    } catch (err) {
      console.error("Error saving location:", err);
      showToast(
        err instanceof Error ? err.message : "Failed to save location",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!location) return;

    showConfirmation(
      `Are you sure you want to delete "${location.name}"?`,
      async () => {
        setIsLoading(true);
        try {
          await adminApi.deleteLocation(location.locationId);
          showToast(`Location "${location.name}" has been deleted`, "info");
          onDeleted();
        } catch (err) {
          console.error("Error deleting location:", err);
          showToast(
            err instanceof Error ? err.message : "Failed to delete location",
            "error"
          );
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? "Edit Location" : "Add New Location"}
          </h2>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="id">ID</label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  disabled={isEditing}
                  className={isEditing ? "disabled" : ""}
                  placeholder="Enter location ID"
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter location name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter location address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="googleMapsUrl">Google Maps URL</label>
              <input
                type="url"
                id="googleMapsUrl"
                name="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={handleInputChange}
                placeholder="Enter Google Maps URL"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="openingHours">Opening Hours</label>
                <input
                  type="text"
                  id="openingHours"
                  name="openingHours"
                  value={formData.openingHours}
                  onChange={handleInputChange}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
              </div>
              <div className="form-group">
                <label htmlFor="updateInterval">Update Interval (min)</label>
                <input
                  type="number"
                  id="updateInterval"
                  name="updateInterval"
                  value={formData.parameters.updateInterval}
                  onChange={handleParameterChange}
                  min="1"
                  placeholder="Enter update interval"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Location Parameters</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="avgDevicesPerPerson">
                  Avg Devices per Person
                </label>
                <input
                  type="number"
                  id="avgDevicesPerPerson"
                  name="avgDevicesPerPerson"
                  value={formData.parameters.avgDevicesPerPerson}
                  onChange={handleParameterChange}
                  step="0.1"
                  min="0"
                  placeholder="1.5"
                />
              </div>
              <div className="form-group">
                <label htmlFor="avgSimsPerPerson">
                  Avg SIM Count per Person
                </label>
                <input
                  type="number"
                  id="avgSimsPerPerson"
                  name="avgSimsPerPerson"
                  value={formData.parameters.avgSimsPerPerson}
                  onChange={handleParameterChange}
                  step="0.1"
                  min="0"
                  placeholder="1.2"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="wifiUsageRatio">WiFi Usage Ratio</label>
                <input
                  type="number"
                  id="wifiUsageRatio"
                  name="wifiUsageRatio"
                  value={formData.parameters.wifiUsageRatio}
                  onChange={handleParameterChange}
                  step="0.1"
                  min="0"
                  max="1"
                  placeholder="0.7"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cellularUsageRatio">Cellular Usage Ratio</label>
                <input
                  type="number"
                  id="cellularUsageRatio"
                  name="cellularUsageRatio"
                  value={formData.parameters.cellularUsageRatio}
                  onChange={handleParameterChange}
                  step="0.1"
                  min="0"
                  max="1"
                  placeholder="0.3"
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <div className="primary-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    {isEditing ? (
                      <i className="fa fa-check" aria-hidden="true"></i>
                    ) : (
                      <i className="fa fa-plus" aria-hidden="true"></i>
                    )}
                    {isEditing ? "Update" : "Add"}
                  </>
                )}
              </button>
            </div>

            {isEditing && (
              <div className="secondary-actions">
                <button
                  type="button"
                  className="delete-btn"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>
                  Delete
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
      <button className="modal-close-btn" onClick={onClose}>
        <i className="fa fa-times" aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default AdminLocationModal;
