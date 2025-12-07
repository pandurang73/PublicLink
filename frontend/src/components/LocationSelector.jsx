import React, { useState, useEffect } from 'react';
import { MapPin, Search, Loader } from 'lucide-react';

const API_BASE_URL = 'https://www.india-location-hub.in/api';

const LocationSelector = ({ formData, setFormData, isRep = false }) => {
    const [loadingPincode, setLoadingPincode] = useState(false);
    const [pincodeError, setPincodeError] = useState('');

    // Data Lists
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [talukas, setTalukas] = useState([]);
    const [villages, setVillages] = useState([]);

    // Loading States for Dropdowns
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingTalukas, setLoadingTalukas] = useState(false);
    const [loadingVillages, setLoadingVillages] = useState(false);

    // Selected Codes (to drive the API fetches)
    const [selectedStateCode, setSelectedStateCode] = useState(null);
    const [selectedDistrictCode, setSelectedDistrictCode] = useState(null);
    const [selectedTalukaCode, setSelectedTalukaCode] = useState(null);

    // Helper: Levenshtein Distance for Fuzzy Matching
    const getLevenshteinDistance = (a, b) => {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    };

    const getClosestMatch = (target, list) => {
        if (!target || list.length === 0) return null;

        const targetLower = target.toLowerCase().trim();
        let bestMatch = null;
        let minDistance = Infinity;

        // First try exact match
        const exactMatch = list.find(item => item.name.toLowerCase().trim() === targetLower);
        if (exactMatch) return exactMatch;

        // Then try fuzzy match
        list.forEach(item => {
            const distance = getLevenshteinDistance(targetLower, item.name.toLowerCase().trim());
            // Allow a threshold relative to string length (e.g., 30% difference max)
            const threshold = Math.max(3, Math.floor(target.length * 0.4));

            if (distance < minDistance && distance <= threshold) {
                minDistance = distance;
                bestMatch = item;
            }
        });

        return bestMatch;
    };

    // 1. Fetch States on Mount
    useEffect(() => {
        const fetchStates = async () => {
            setLoadingStates(true);
            try {
                const response = await fetch(`${API_BASE_URL}/locations/states`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data && result.data.states) {
                        setStates(result.data.states);
                    }
                }
            } catch (error) {
                console.error('Error fetching states:', error);
            } finally {
                setLoadingStates(false);
            }
        };
        fetchStates();
    }, []);

    // 2. Sync State Code when formData.state changes
    useEffect(() => {
        if (formData.state && states.length > 0) {
            // Use fuzzy matching for State
            const stateObj = getClosestMatch(formData.state, states);

            if (stateObj) {
                if (stateObj.code !== selectedStateCode) {
                    setSelectedStateCode(stateObj.code);
                }
                // Auto-correct the name in formData if it was a fuzzy match
                if (stateObj.name !== formData.state) {
                    setFormData(prev => ({ ...prev, state: stateObj.name }));
                }
            }
        } else if (!formData.state) {
            setSelectedStateCode(null);
            setDistricts([]);
        }
    }, [formData.state, states]);

    // 3. Fetch Districts when State Code changes
    useEffect(() => {
        const fetchDistricts = async () => {
            if (!selectedStateCode) return;
            setLoadingDistricts(true);
            try {
                // API returns all districts, so we must filter client-side
                const response = await fetch(`${API_BASE_URL}/locations/districts?state_code=${selectedStateCode}`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data && result.data.districts) {
                        // Filter districts by the selected state name
                        // Note: API returns state_name in uppercase
                        // We use the selectedStateCode to find the state name from our states list to be safe
                        const currentState = states.find(s => s.code === selectedStateCode);
                        const stateName = currentState ? currentState.name.toUpperCase() : formData.state.toUpperCase();

                        const filteredDistricts = result.data.districts.filter(
                            d => d.state_name.toUpperCase() === stateName
                        );
                        setDistricts(filteredDistricts);
                    }
                }
            } catch (error) {
                console.error('Error fetching districts:', error);
            } finally {
                setLoadingDistricts(false);
            }
        };
        fetchDistricts();
    }, [selectedStateCode, formData.state, states]);

    // 4. Sync District Code when formData.district changes
    useEffect(() => {
        if (formData.district && districts.length > 0) {
            // Use fuzzy matching for District
            const districtObj = getClosestMatch(formData.district, districts);

            if (districtObj) {
                if (districtObj.code !== selectedDistrictCode) {
                    setSelectedDistrictCode(districtObj.code);
                }
                // Auto-correct the name in formData if it was a fuzzy match
                if (districtObj.name !== formData.district) {
                    setFormData(prev => ({ ...prev, district: districtObj.name }));
                }
            }
        } else if (!formData.district) {
            setSelectedDistrictCode(null);
            setTalukas([]);
        }
    }, [formData.district, districts]);

    // 5. Fetch Talukas when District Code changes
    useEffect(() => {
        const fetchTalukas = async () => {
            if (!selectedDistrictCode) return;
            setLoadingTalukas(true);
            try {
                const response = await fetch(`${API_BASE_URL}/locations/talukas?district_code=${selectedDistrictCode}`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data && result.data.talukas) {
                        // Filter talukas by the selected district name
                        const currentDistrict = districts.find(d => d.code === selectedDistrictCode);
                        const districtName = currentDistrict ? currentDistrict.name.toUpperCase() : formData.district.toUpperCase();

                        const filteredTalukas = result.data.talukas.filter(
                            t => t.district_name && t.district_name.toUpperCase() === districtName
                        );
                        setTalukas(filteredTalukas);
                    }
                }
            } catch (error) {
                console.error('Error fetching talukas:', error);
            } finally {
                setLoadingTalukas(false);
            }
        };
        fetchTalukas();
    }, [selectedDistrictCode, formData.district, districts]);

    // 6. Sync Taluka Code when formData.taluka changes
    useEffect(() => {
        if (formData.taluka && talukas.length > 0) {
            // Use fuzzy matching for Taluka
            const talukaObj = getClosestMatch(formData.taluka, talukas);

            if (talukaObj) {
                if (talukaObj.code !== selectedTalukaCode) {
                    setSelectedTalukaCode(talukaObj.code);
                }
                // Auto-correct the name in formData if it was a fuzzy match
                if (talukaObj.name !== formData.taluka) {
                    setFormData(prev => ({ ...prev, taluka: talukaObj.name }));
                }
            }
        } else if (!formData.taluka) {
            setSelectedTalukaCode(null);
            setVillages([]);
        }
    }, [formData.taluka, talukas]);

    // 7. Fetch Villages when Taluka Code changes
    useEffect(() => {
        const fetchVillages = async () => {
            if (!selectedTalukaCode) return;
            setLoadingVillages(true);
            try {
                // API requires state, district, and taluka names for fetching villages
                const queryParams = new URLSearchParams({
                    state: formData.state,
                    district: formData.district,
                    taluka: formData.taluka
                });

                const response = await fetch(`${API_BASE_URL}/locations/villages?${queryParams.toString()}`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data && result.data.villages) {
                        setVillages(result.data.villages);
                    }
                }
            } catch (error) {
                console.error('Error fetching villages:', error);
            } finally {
                setLoadingVillages(false);
            }
        };
        fetchVillages();
    }, [selectedTalukaCode, formData.taluka, formData.district, formData.state]);

    // 8. Sync Village Code/Name when formData.village changes (Fuzzy Match)
    useEffect(() => {
        if (formData.village && villages.length > 0) {
            // Use fuzzy matching for Village
            const villageObj = getClosestMatch(formData.village, villages);

            if (villageObj) {
                // Auto-correct the name in formData if it was a fuzzy match
                // Note: Villages might not have a code in some APIs, or we might just use the name
                if (villageObj.name !== formData.village) {
                    setFormData(prev => ({ ...prev, village: villageObj.name }));
                }
            }
        }
    }, [formData.village, villages]);


    // Handlers
    const handleStateChange = (e) => {
        setFormData({
            ...formData,
            state: e.target.value,
            district: '',
            taluka: '',
            village: ''
        });
    };

    const handleDistrictChange = (e) => {
        setFormData({
            ...formData,
            district: e.target.value,
            taluka: '',
            village: ''
        });
    };

    const handleTalukaChange = (e) => {
        setFormData({
            ...formData,
            taluka: e.target.value,
            village: ''
        });
    };


    const handlePincodeLookup = async () => {
        if (!formData.pincode || formData.pincode.length !== 6) {
            setPincodeError('Please enter a valid 6-digit pincode.');
            return;
        }

        setLoadingPincode(true);
        setPincodeError('');

        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
            const data = await response.json();

            if (data && data[0].Status === 'Success') {
                const postOffice = data[0].PostOffice[0];

                // Pincode API returns names. We set them in formData.
                // The useEffect chains above will automatically resolve IDs and fetch lists.
                // Note: Names must match reasonably well with the India Location Hub API.

                setFormData({
                    ...formData,
                    state: postOffice.State,
                    district: postOffice.District,
                    taluka: postOffice.Block !== 'NA' ? postOffice.Block : '', // Sometimes Block is NA
                    village: postOffice.Name
                });
            } else {
                setPincodeError('Invalid Pincode or data not found.');
            }
        } catch (error) {
            console.error('Error fetching pincode data:', error);
            setPincodeError('Error fetching data. Please try manually.');
        } finally {
            setLoadingPincode(false);
        }
    };

    return (
        <div className="space-y-4 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-900">Address Details</h3>

            {/* Pincode Section */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Pincode</label>
                <div className="mt-1 relative rounded-md shadow-sm flex gap-2">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            name="pincode"
                            type="text"
                            maxLength="6"
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            className={`focus:ring-${isRep ? 'primary' : 'secondary'} focus:border-${isRep ? 'primary' : 'secondary'} block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2`}
                            placeholder="Enter Pincode"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handlePincodeLookup}
                        disabled={loadingPincode}
                        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${isRep ? 'bg-primary hover:bg-blue-700' : 'bg-secondary hover:bg-teal-600'} focus:outline-none transition`}
                    >
                        {loadingPincode ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        <span className="ml-2 hidden sm:inline">Auto-fill</span>
                    </button>
                </div>
                {pincodeError && <p className="mt-1 text-xs text-red-500">{pincodeError}</p>}
            </div>

            {/* State */}
            <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <select
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="">{loadingStates ? 'Loading States...' : 'Select State'}</option>
                    {states.map(state => (
                        <option key={state.code} value={state.name}>{state.name}</option>
                    ))}
                </select>
            </div>

            {/* District */}
            <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <select
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                    disabled={!selectedStateCode}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                >
                    <option value="">{loadingDistricts ? 'Loading Districts...' : 'Select District'}</option>
                    {districts.map(dist => (
                        <option key={dist.code} value={dist.name}>{dist.name}</option>
                    ))}
                </select>
            </div>

            {/* Taluka */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Taluka</label>
                    <select
                        name="taluka"
                        value={formData.taluka}
                        onChange={handleTalukaChange}
                        disabled={!selectedDistrictCode}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                    >
                        <option value="">{loadingTalukas ? 'Loading Talukas...' : 'Select Taluka'}</option>
                        {talukas.map(taluka => (
                            <option key={taluka.code} value={taluka.name}>{taluka.name}</option>
                        ))}
                    </select>
                </div>

                {/* Village */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Village/Area</label>
                    <select
                        name="village"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        disabled={!selectedTalukaCode}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                    >
                        <option value="">{loadingVillages ? 'Loading Villages...' : 'Select Village'}</option>
                        {villages.map(village => (
                            <option key={village.code || village.name} value={village.name}>{village.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default LocationSelector;
