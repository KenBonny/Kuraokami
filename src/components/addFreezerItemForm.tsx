﻿import {type FreezerItem, Unit} from "./models.ts";
import React, {useRef, useState} from "react";
import {config} from "../config.ts";

export interface AddFreezerItemFormProps {
    onAddItem: (item: FreezerItem) => void;
}

export function AddFreezerItemForm({onAddItem}: AddFreezerItemFormProps) {
    const [item, setItem] = useState<FreezerItem>(defaultValues());
    const nameInputRef = useRef<HTMLInputElement>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const {name, value} = e.target;

        const parseValue = () => {
            switch (name) {
                case 'unit':
                case 'amount':
                    return Number(value);
                case 'frozen':
                case 'expiration':
                    return new Date(value);
                default:
                    return value;
            }
        };
        setItem(prev => ({
            ...prev,
            [name]: parseValue()
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onAddItem(item);
        setItem(defaultValues());
        nameInputRef.current?.focus();
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input type="text"
                   id="name"
                   name="name"
                   placeholder="Name"
                   value={item.name}
                   onChange={handleChange}
                   ref={nameInputRef}
                   required />

            <label htmlFor="type">Product Type</label>
            <input type="text" id="type" name="type" placeholder="Type" value={item.type} onChange={handleChange} />

            <label htmlFor="amount">Amount</label>
            <input type="number"
                   id="amount"
                   name="amount"
                   min="1"
                   value={item.amount}
                   onChange={handleChange}
                   required />

            <select id="unit" name="unit" value={item.unit} onChange={handleChange} required>
                {unitKeys.map(key => (
                    <option value={Unit[key]} key={Unit[key]}>{key}</option>
                ))}
            </select>

            <label htmlFor="frozen">Date Frozen</label>
            <input type="date"
                   id="frozen"
                   name="frozen"
                   value={formatDate(item.frozen)}
                   max={formatDate(today)}
                   onChange={handleChange}
                   required />

            <label htmlFor="expiration">Date Frozen</label>
            <input type="date"
                   id="expiration"
                   name="expiration"
                   value={formatDate(item.expiration)}
                   min={formatDate(today)}
                   max={formatDate(maxExpiration)}
                   onChange={handleChange}
                   required />

            <button type="submit">Add</button>
        </form>
    );
}

const today = new Date();
const defaultExpiration = getDate(config.defaultExpiration);
const maxExpiration = getDate(config.maxExpiration);
const unitKeys = Object.keys(Unit).filter(key => isNaN(Number(key))).sort() as Array<keyof typeof Unit>;
const defaultValues = () => ({
    id: 0,
    name: "",
    type: "",
    amount: 1,
    unit: Unit.gram,
    frozen: today,
    expiration: defaultExpiration,
    created: new Date(),
    isDeleted: false,
} as FreezerItem);

function getDate(monthsFromNow: number): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + monthsFromNow);
    return date;
}

// format: yyyy-mm-dd
function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
}