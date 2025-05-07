port { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTask } from "@/hooks/useWebSocket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Task form schema
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  deadline: z.string().optional(),
  time: z.string().optional(),
  categoryId: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  notify30Min: z.boolean().optional(),
  notify1Hour: z.boolean().optional(),
  notify1Day: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: FormValues;
}

export default function TaskModal({ isOpen, onClose, initialData }: TaskModalProps) {
  const { categories, createTask } = useTask();
  
  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      deadline: "",
      time: "",
      categoryId: categories.length > 0 ? categories[0].id.toString() : "",
      priority: "medium",
      notify30Min: true,
      notify1Hour: false,
      notify1Day: false,
    },
  });
  
  // Update default categoryId when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !form.getValues().categoryId) {
      form.setValue("categoryId", categories[0].id.toString());
    }
  }, [categories, form]);
  
  // Form submission handler
  const onSubmit = (data: FormValues) => {
    let deadline: Date | undefined;
    
    // Combine date and time if both are provided
    if (data.deadline) {
      const dateValue = new Date(data.deadline);
      
      if (data.time) {
        const [hours, minutes] = data.time.split(":").map(Number);
        dateValue.setHours(hours, minutes);
      }
      
      deadline = dateValue;
    }
    
    // Create task
    createTask({
      title: data.title,
      description: data.description || "",
      categoryId: parseInt(data.categoryId),
      priority: data.priority,
      deadline: deadline,
      status: "pending",
      progress: 0
    });
    
    // Close modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">New Task</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter task description" 
                      rows={3} 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormLabel>Notifications</FormLabel>
              <div className="mt-2 space-y-2">
                <FormField
                  control={form.control}
                  name="notify30Min"
                  render={({ field }) => (
                    <div className="flex items-center">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          id="notify30Min" 
                        />
                      </FormControl>
                      <label htmlFor="notify30Min" className="ml-2 text-sm text-gray-700">
                        30 minutes before
                      </label>
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notify1Hour"
                  render={({ field }) => (
                    <div className="flex items-center">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          id="notify1Hour" 
                        />
                      </FormControl>
                      <label htmlFor="notify1Hour" className="ml-2 text-sm text-gray-700">
                        1 hour before
                      </label>
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notify1Day"
                  render={({ field }) => (
                    <div className="flex items-center">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          id="notify1Day" 
                        />
                      </FormControl>
                      <label htmlFor="notify1Day" className="ml-2 text-sm text-gray-700">
                        1 day before
                      </label>
                    </div>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}