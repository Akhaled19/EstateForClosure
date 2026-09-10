import { useState } from "react";


type EbayAspect = {
    name: string;
    required: boolean;
    dataType: string;
    cardinality: string;
    mode: string;
    variation: boolean;
    applicableTo: string[];
    values: string[];
};

type EbayRequiredAspectsProps = {
    missingAspects: EbayAspect[];
    onAspectsChange: (aspects: Record<string, string[]>) => void;
};


export default function EbayAspects({missingAspects, onAspectsChange}: EbayRequiredAspectsProps) {
    const [aspectValues, setAspectValues] = useState<Record<string, string[]>>({});

    return (
        <div>
            
            <div className = "-mt-2 space-y-3"> 
                {missingAspects.map((aspect) => (
                    <div key = {aspect.name}>
                        <label className = "block text-sm font-medium mb-2">
                            {aspect.required && (
                                <span className = "text-red-600">*</span>
                            )}
                            {aspect.name}
                        </label>

                        {aspect.mode === "SELECTION_ONLY" ? (
                            <select
                                value = {aspectValues[aspect.name]?.[0] || ""}
                                onChange = {(e) => {
                                    const updatedAspects = {...aspectValues, [aspect.name]: [e.target.value]};
                                    setAspectValues(updatedAspects);
                                    onAspectsChange(updatedAspects);
                                }}
                                className="text-sm w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-gray-400"
                            >
                                <option value = ""> Select {aspect.name} </option>

                                {aspect.values.map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input 
                                type = "text" 
                                placeholder = {`Enter ${aspect.name}`} 
                                className = "text-sm w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-gray-400"
                                value = {aspectValues[aspect.name]?.[0] || ""} 
                                onChange = {(e) => {
                                    const updatedAspects = {...aspectValues, [aspect.name]: [e.target.value]};
                                    setAspectValues(updatedAspects);
                                    onAspectsChange(updatedAspects);
                                }}
                            />
                        )}
                    </div>
                ))}
        </div>
    </div>
    );
}