"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, X } from "lucide-react";

export default function CustomQuestionsBuilder({ field }) {
    const questions = Array.isArray(field.value) ? field.value : [];
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    
    // Modal local state
    const [questionType, setQuestionType] = useState("short_text");
    const [isRequired, setIsRequired] = useState(false);
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState([]);
    const [currentOption, setCurrentOption] = useState("");

    const openCreateModal = () => {
        setQuestionType("short_text");
        setIsRequired(false);
        setQuestionText("");
        setOptions([]);
        setCurrentOption("");
        setEditIndex(-1);
        setIsModalOpen(true);
    };

    const openEditModal = (index) => {
        const q = questions[index];
        setQuestionType(q.question_type || "short_text");
        setIsRequired(q.is_required || false);
        setQuestionText(q.question || "");
        setOptions(q.options || []);
        setCurrentOption("");
        setEditIndex(index);
        setIsModalOpen(true);
    };

    const saveQuestion = () => {
        if (!questionText.trim()) return;
        
        const newQ = {
            id: editIndex === -1 ? Date.now().toString() : questions[editIndex].id || Date.now().toString(),
            question_type: questionType,
            is_required: isRequired,
            question: questionText,
            options: (questionType === "dropdown" || questionType === "multi_choice") ? options : null,
            order: editIndex === -1 ? questions.length : questions[editIndex].order
        };

        let newQuestions = [...questions];
        if (editIndex === -1) {
            newQuestions.push(newQ);
        } else {
            newQuestions[editIndex] = newQ;
        }

        field.onChange(newQuestions);
        setIsModalOpen(false);
    };

    const deleteQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        field.onChange(newQuestions);
    };

    const addOption = () => {
        if (currentOption.trim() && !options.includes(currentOption.trim())) {
            setOptions([...options, currentOption.trim()]);
            setCurrentOption("");
        }
    };

    const removeOption = (optName) => {
        setOptions(options.filter(o => o !== optName));
    };

    const needsOptions = questionType === "dropdown" || questionType === "multi_choice";

    const getTypeLabel = (val) => {
        const map = {
            "short_text": "Short Text",
            "long_text": "Long Text",
            "dropdown": "Dropdown",
            "multi_choice": "Multi Choice",
            "number": "Number",
            "date": "Date"
        };
        return map[val] || val;
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Custom Questions</h4>
                <Button type="button" onClick={openCreateModal} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" /> Add Custom Question
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {questions.map((q, index) => (
                    <Card key={q.id || index} className="shadow-sm">
                        <CardContent className="p-4 flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h5 className="font-medium text-sm">{q.question}</h5>
                                    {q.is_required && (
                                        <span className="bg-red-100 text-red-600 text-[10px] px-2 py-[2px] rounded-full font-bold uppercase">
                                            Required
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded inline-block">
                                    {getTypeLabel(q.question_type)}
                                </p>
                                {(q.question_type === "dropdown" || q.question_type === "multi_choice") && q.options && q.options.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {q.options.map(opt => (
                                            <span key={opt} className="text-[11px] bg-slate-100 border border-slate-200 px-2 rounded-full">
                                                {opt}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button type="button" variant="ghost" size="icon" onClick={() => openEditModal(index)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => deleteQuestion(index)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                
                {questions.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                        No custom questions added yet.
                    </div>
                )}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editIndex === -1 ? 'Add Custom Question' : 'Edit Custom Question'}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Question Type</label>
                            <select 
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={questionType} 
                                onChange={(e) => setQuestionType(e.target.value)}
                            >
                                <option value="short_text">Short Text</option>
                                <option value="long_text">Long Text</option>
                                <option value="dropdown">Dropdown</option>
                                <option value="multi_choice">Multi Choice</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-md border">
                            <label className="text-sm font-medium cursor-pointer" htmlFor="is_req">Is Required?</label>
                            <Switch id="is_req" checked={isRequired} onCheckedChange={setIsRequired} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Question</label>
                            <Input 
                                placeholder="Type your question here..." 
                                value={questionText} 
                                onChange={(e) => setQuestionText(e.target.value)}
                            />
                        </div>

                        {needsOptions && (
                            <div className="space-y-2 pt-2 border-t mt-4">
                                <label className="text-sm font-medium">Options</label>
                                <div className="flex items-center gap-2">
                                    <Input 
                                        placeholder="Add an option" 
                                        value={currentOption}
                                        onChange={(e) => setCurrentOption(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } }}
                                    />
                                    <Button type="button" onClick={addOption} variant="secondary">Add</Button>
                                </div>
                                
                                {options.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {options.map((opt) => (
                                            <div key={opt} className="flex items-center gap-1 bg-slate-100 border px-3 py-1 text-sm rounded-full">
                                                <span>{opt}</span>
                                                <button type="button" onClick={() => removeOption(opt)} className="text-slate-500 hover:text-red-500">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={saveQuestion} disabled={!questionText.trim()}>Save Question</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
