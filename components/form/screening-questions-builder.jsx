"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2, Plus } from "lucide-react";

export default function ScreeningQuestionsBuilder({ field }) {
    const questions = Array.isArray(field.value) ? field.value : [];
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Modal local state
    const [questionType, setQuestionType] = useState("yes/no");
    const [questionText, setQuestionText] = useState("");
    const [minValue, setMinValue] = useState("");

    const openCreateModal = () => {
        setQuestionType("yes/no");
        setQuestionText("");
        setMinValue("");
        setIsModalOpen(true);
    };

    const saveQuestion = () => {
        if (!questionText.trim()) return;
        
        const newQ = {
            id: Date.now().toString(),
            question_type: questionType,
            question: questionText,
            min_value: questionType === "number" ? minValue : null,
            ideal_answer: questionType === "yes/no" ? "yes" : null,
            must_have: false
        };

        const newQuestions = [...questions, newQ];
        field.onChange(newQuestions);
        setIsModalOpen(false);
    };

    const updateQuestion = (index, key, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [key]: value };
        field.onChange(newQuestions);
    };

    const deleteQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        field.onChange(newQuestions);
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-base font-semibold">Active Screening Questions ({questions.length})</h4>
                    <p className="text-sm text-muted-foreground mt-1">Set ideal answers to auto-filter candidates</p>
                </div>
                <Button type="button" onClick={openCreateModal} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" /> Add Screening Section
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-4">
                {questions.map((q, index) => (
                    <Card key={q.id || index} className="shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h5 className="font-medium text-sm">{q.question}</h5>
                                    </div>
                                    <p className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded inline-block uppercase font-medium">
                                        {q.question_type === 'yes/no' ? 'Yes / No' : 'Number'}
                                    </p>
                                </div>
                                
                                <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                                    {/* Ideal Answer configuration */}
                                    {q.question_type === "yes/no" ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium whitespace-nowrap">Ideal Answer:</span>
                                            <select 
                                                className="flex h-8 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                value={q.ideal_answer || "yes"} 
                                                onChange={(e) => updateQuestion(index, 'ideal_answer', e.target.value)}
                                            >
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium whitespace-nowrap">Minimum Value:</span>
                                            <Input 
                                                type="number"
                                                className="h-8 w-24"
                                                value={q.min_value || ""} 
                                                onChange={(e) => updateQuestion(index, 'min_value', e.target.value)}
                                            />
                                        </div>
                                    )}

                                    {/* Must-Have Toggle */}
                                    <div className="flex items-center gap-2 pl-2 md:pl-4 md:border-l">
                                        <label className="text-sm font-medium cursor-pointer" htmlFor={`must-have-${index}`}>Must-have</label>
                                        <Switch 
                                            id={`must-have-${index}`}
                                            checked={!!q.must_have} 
                                            onCheckedChange={(checked) => updateQuestion(index, 'must_have', checked)} 
                                        />
                                    </div>

                                    {/* Delete Button */}
                                    <div className="pl-2">
                                        <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-600 h-8 w-8" onClick={() => deleteQuestion(index)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                
                {questions.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg bg-slate-50">
                        <p className="text-muted-foreground text-sm font-medium">No screening questions added yet.</p>
                        <p className="text-muted-foreground text-xs mt-1">Select questions from above to get started.</p>
                    </div>
                )}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Screening Question</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Question Type</label>
                            <select 
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                value={questionType} 
                                onChange={(e) => setQuestionType(e.target.value)}
                            >
                                <option value="yes/no">Yes/No</option>
                                <option value="number">Number</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Question</label>
                            <Input 
                                placeholder="Type your question here..." 
                                value={questionText} 
                                onChange={(e) => setQuestionText(e.target.value)}
                            />
                        </div>

                        {questionType === "number" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Minimum Value</label>
                                <Input 
                                    type="number"
                                    placeholder="Enter minimum acceptable value" 
                                    value={minValue} 
                                    onChange={(e) => setMinValue(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                    
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={saveQuestion} disabled={!questionText.trim()}>Add Question</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
