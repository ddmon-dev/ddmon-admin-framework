'use client';

import { useState } from 'react';

import {
  AlertCircle,
  Bell,
  Check,
  Info,
  Loader2,
  Mail,
  Plus,
  Search,
  Settings,
  Trash2,
  User,
} from 'lucide-react';

// Basic Components
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Separator } from '@/shared/ui/separator';
import { Skeleton } from '@/shared/ui/skeleton';
import { Spinner } from '@/shared/ui/spinner';
import { Progress } from '@/shared/ui/progress';

// Input Components
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Checkbox } from '@/shared/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Switch } from '@/shared/ui/switch';
import { Label } from '@/shared/ui/label';
import { Slider } from '@/shared/ui/slider';

// Layout Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';

// Overlay Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

// Navigation
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

// Theme
import { ThemeToggle } from '@/shared/ui/theme-switcher';

// Toast
import { toast } from 'sonner';

// App Dialog
import { useDialog } from '@/shared/ui/app-dialog';

// Section Component
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className='scroll-mt-8'
    >
      <h2 className='text-2xl font-bold mb-6 pb-2 border-b'>{title}</h2>
      <div className='space-y-8'>{children}</div>
    </section>
  );
}

// Subsection Component
function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-muted-foreground'>{title}</h3>
      <div className='flex flex-wrap gap-3 items-center'>{children}</div>
    </div>
  );
}

const NAV_ITEMS = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'badges', label: 'Badges' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'avatars', label: 'Avatars' },
  { id: 'loading', label: 'Loading' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'selections', label: 'Selections' },
  { id: 'cards', label: 'Cards' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'accordion', label: 'Accordion' },
  { id: 'dialogs', label: 'Dialogs' },
  { id: 'app-dialogs', label: 'App Dialogs' },
  { id: 'tooltips', label: 'Tooltips' },
  { id: 'toast', label: 'Toast' },
];

export default function UIPreviewPage() {
  const [progress, setProgress] = useState(60);
  const dialog = useDialog();

  return (
    <div className='flex min-h-dvh'>
      {/* Sidebar Navigation */}
      <aside className='w-72 shrink-0 border-r bg-background sticky top-0 h-dvh overflow-y-auto p-4 space-y-4'>
        <h1 className='text-lg font-bold shrink-0'>UI Preview</h1>
        <nav className='space-y-1'>
          {NAV_ITEMS.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className='block px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors'
            >
              {item.label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-8 space-y-16'>
        {/* Buttons Section */}
        <Section
          id='buttons'
          title='Buttons'
        >
          <Subsection title='Default Variants'>
            <Button variant='default'>Default</Button>
            <Button variant='secondary'>Secondary</Button>
            <Button variant='outline'>Outline</Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='link'>Link</Button>
          </Subsection>

          <Subsection title='Semantic Variants'>
            <Button variant='destructive'>Destructive</Button>
            <Button variant='success'>Success</Button>
            <Button variant='warning'>Warning</Button>
            <Button variant='info'>Info</Button>
          </Subsection>

          <Subsection title='Light Variants (Soft)'>
            <Button variant='default-light'>Primary Light</Button>
            <Button variant='destructive-light'>Destructive Light</Button>
            <Button variant='success-light'>Success Light</Button>
            <Button variant='warning-light'>Warning Light</Button>
            <Button variant='info-light'>Info Light</Button>
          </Subsection>

          <Subsection title='Neutral Variants'>
            <Button variant='muted'>Muted</Button>
            <Button variant='black'>Black</Button>
          </Subsection>

          <Subsection title='Sizes'>
            <Button size='xs'>Extra Small</Button>
            <Button size='sm'>Small</Button>
            <Button size='default'>Default</Button>
            <Button size='lg'>Large</Button>
            <Button size='icon'>
              <Plus />
            </Button>
            <Button size='icon-sm'>
              <Plus />
            </Button>
            <Button size='icon-lg'>
              <Plus />
            </Button>
          </Subsection>

          <Subsection title='With Icons'>
            <Button>
              <Mail /> Send Email
            </Button>
            <Button variant='destructive'>
              <Trash2 /> Delete
            </Button>
            <Button variant='success'>
              <Check /> Confirm
            </Button>
            <Button variant='outline'>
              <Settings /> Settings
            </Button>
          </Subsection>

          <Subsection title='States'>
            <Button disabled>Disabled</Button>
            <Button
              disabled
              variant='destructive'
            >
              Disabled
            </Button>
            <Button>
              <Loader2 className='animate-spin' /> Loading
            </Button>
          </Subsection>
        </Section>

        {/* Badges Section */}
        <Section
          id='badges'
          title='Badges'
        >
          <Subsection title='Default Variants'>
            <Badge>Default</Badge>
            <Badge variant='secondary'>Secondary</Badge>
            <Badge variant='outline'>Outline</Badge>
          </Subsection>

          <Subsection title='Semantic Variants'>
            <Badge variant='destructive'>Destructive</Badge>
            <Badge variant='success'>Success</Badge>
            <Badge variant='warning'>Warning</Badge>
            <Badge variant='info'>Info</Badge>
          </Subsection>

          <Subsection title='Soft Variants'>
            <Badge variant='default-light'>Primary Light</Badge>
            <Badge variant='destructive-light'>Destructive Light</Badge>
            <Badge variant='success-light'>Success Light</Badge>
            <Badge variant='warning-light'>Warning Light</Badge>
            <Badge variant='info-light'>Info Light</Badge>
          </Subsection>

          <Subsection title='Muted'>
            <Badge variant='muted'>Muted</Badge>
          </Subsection>
        </Section>

        {/* Alerts Section */}
        <Section
          id='alerts'
          title='Alerts'
        >
          <div className='space-y-4 max-w-2xl'>
            <Alert>
              <Info className='size-4' />
              <AlertTitle>Default Alert</AlertTitle>
              <AlertDescription>This is a default alert message.</AlertDescription>
            </Alert>

            <Alert variant='destructive'>
              <AlertCircle className='size-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Something went wrong. Please try again.</AlertDescription>
            </Alert>

            <Alert variant='success'>
              <Check className='size-4' />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Your changes have been saved successfully.</AlertDescription>
            </Alert>

            <Alert variant='warning'>
              <AlertCircle className='size-4' />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>Please review your input before proceeding.</AlertDescription>
            </Alert>

            <Alert variant='info'>
              <Info className='size-4' />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>Here is some useful information for you.</AlertDescription>
            </Alert>
          </div>
        </Section>

        {/* Avatars Section */}
        <Section
          id='avatars'
          title='Avatars'
        >
          <Subsection title='Variants'>
            <Avatar>
              <AvatarImage
                src='https://github.com/shadcn.png'
                alt='@shadcn'
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>
                <User className='size-4' />
              </AvatarFallback>
            </Avatar>
          </Subsection>
        </Section>

        {/* Loading Section */}
        <Section
          id='loading'
          title='Loading States'
        >
          <Subsection title='Spinner'>
            <Spinner />
            <Spinner className='size-8' />
            <Spinner className='size-12' />
          </Subsection>

          <Subsection title='Progress'>
            <div className='w-64'>
              <Progress value={progress} />
            </div>
            <Button
              size='sm'
              onClick={() => setProgress(p => Math.min(100, p + 10))}
            >
              +10%
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setProgress(p => Math.max(0, p - 10))}
            >
              -10%
            </Button>
          </Subsection>

          <Subsection title='Skeleton'>
            <div className='flex items-center space-x-4'>
              <Skeleton className='h-12 w-12 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-[250px]' />
                <Skeleton className='h-4 w-[200px]' />
              </div>
            </div>
          </Subsection>
        </Section>

        {/* Inputs Section */}
        <Section
          id='inputs'
          title='Input Components'
        >
          <Subsection title='Text Input'>
            <Input
              placeholder='Default input'
              className='w-64'
            />
            <Input
              placeholder='Disabled'
              disabled
              className='w-64'
            />
          </Subsection>

          <Subsection title='With Icons'>
            <div className='relative w-64'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
              <Input
                placeholder='Search...'
                className='pl-9'
              />
            </div>
          </Subsection>

          <Subsection title='Textarea'>
            <Textarea
              placeholder='Enter your message...'
              className='w-80'
            />
          </Subsection>

          <Subsection title='Slider'>
            <Slider
              defaultValue={[50]}
              max={100}
              step={1}
              className='w-64'
            />
          </Subsection>
        </Section>

        {/* Selections Section */}
        <Section
          id='selections'
          title='Selection Components'
        >
          <Subsection title='Checkbox'>
            <div className='flex items-center space-x-2'>
              <Checkbox id='terms' />
              <Label htmlFor='terms'>Accept terms</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='checked'
                defaultChecked
              />
              <Label htmlFor='checked'>Checked</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='disabled'
                disabled
              />
              <Label htmlFor='disabled'>Disabled</Label>
            </div>
          </Subsection>

          <Subsection title='Radio Group'>
            <RadioGroup defaultValue='option-1'>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem
                  value='option-1'
                  id='option-1'
                />
                <Label htmlFor='option-1'>Option 1</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem
                  value='option-2'
                  id='option-2'
                />
                <Label htmlFor='option-2'>Option 2</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem
                  value='option-3'
                  id='option-3'
                />
                <Label htmlFor='option-3'>Option 3</Label>
              </div>
            </RadioGroup>
          </Subsection>

          <Subsection title='Switch'>
            <div className='flex items-center space-x-2'>
              <Switch id='airplane-mode' />
              <Label htmlFor='airplane-mode'>Airplane Mode</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Switch
                id='checked-switch'
                defaultChecked
              />
              <Label htmlFor='checked-switch'>Enabled</Label>
            </div>
          </Subsection>

          <Subsection title='Select'>
            <Select>
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='Select option' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='option1'>Option 1</SelectItem>
                <SelectItem value='option2'>Option 2</SelectItem>
                <SelectItem value='option3'>Option 3</SelectItem>
              </SelectContent>
            </Select>
          </Subsection>
        </Section>

        {/* Cards Section */}
        <Section
          id='cards'
          title='Cards'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content with some text.</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>You have 3 unread messages.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='flex items-center gap-3'>
                  <Bell className='size-4' />
                  <span>New message from John</span>
                </div>
                <div className='flex items-center gap-3'>
                  <Bell className='size-4' />
                  <span>System update available</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold'>1,234</div>
                <p className='text-sm text-muted-foreground'>Total users</p>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Tabs Section */}
        <Section
          id='tabs'
          title='Tabs'
        >
          <Tabs
            defaultValue='account'
            className='w-full max-w-lg'
          >
            <TabsList>
              <TabsTrigger value='account'>Account</TabsTrigger>
              <TabsTrigger value='password'>Password</TabsTrigger>
              <TabsTrigger value='settings'>Settings</TabsTrigger>
            </TabsList>
            <TabsContent
              value='account'
              className='p-4 border rounded-b-lg'
            >
              <p>Account settings and preferences.</p>
            </TabsContent>
            <TabsContent
              value='password'
              className='p-4 border rounded-b-lg'
            >
              <p>Change your password here.</p>
            </TabsContent>
            <TabsContent
              value='settings'
              className='p-4 border rounded-b-lg'
            >
              <p>Application settings.</p>
            </TabsContent>
          </Tabs>
        </Section>

        {/* Accordion Section */}
        <Section
          id='accordion'
          title='Accordion'
        >
          <Accordion
            type='single'
            collapsible
            className='w-full max-w-lg'
          >
            <AccordionItem value='item-1'>
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2'>
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other components.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It's animated by default with smooth transitions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        {/* Dialogs Section */}
        <Section
          id='dialogs'
          title='Dialogs & Overlays'
        >
          <Subsection title='Dialog'>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    This is a dialog description. You can put any content here.
                  </DialogDescription>
                </DialogHeader>
                <div className='py-4'>Dialog content goes here.</div>
                <DialogFooter>
                  <Button variant='outline'>Cancel</Button>
                  <Button>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Subsection>

          <Subsection title='Sheet'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline'>Open Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet Title</SheetTitle>
                  <SheetDescription>This is a sheet that slides in from the side.</SheetDescription>
                </SheetHeader>
                <div className='py-4'>Sheet content goes here.</div>
              </SheetContent>
            </Sheet>
          </Subsection>

          <Subsection title='Popover'>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline'>Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent className='w-80'>
                <div className='space-y-2'>
                  <h4 className='font-medium'>Popover Title</h4>
                  <p className='text-sm text-muted-foreground'>
                    This is a popover with some content inside.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </Subsection>
        </Section>

        {/* App Dialogs Section */}
        <Section
          id='app-dialogs'
          title='App Dialogs (useDialog)'
        >
          <Subsection title='Alert - Variants'>
            <Button
              variant='outline'
              onClick={() =>
                dialog.alert({ title: 'Default', description: 'This is a default alert.' })
              }
            >
              Default
            </Button>
            <Button
              variant='success-light'
              onClick={() =>
                dialog.alert({
                  title: 'Success',
                  description: 'Operation completed!',
                  variant: 'success',
                })
              }
            >
              Success
            </Button>
            <Button
              variant='destructive-light'
              onClick={() =>
                dialog.alert({
                  title: 'Error',
                  description: 'Something went wrong.',
                  variant: 'error',
                })
              }
            >
              Error
            </Button>
            <Button
              variant='warning-light'
              onClick={() =>
                dialog.alert({
                  title: 'Warning',
                  description: 'Please check your input.',
                  variant: 'warning',
                })
              }
            >
              Warning
            </Button>
          </Subsection>

          <Subsection title='Alert - Layouts'>
            <Button
              variant='outline'
              onClick={() =>
                dialog.alert({
                  title: 'Default Layout',
                  description: 'Icon and title are side by side.',
                  variant: 'success',
                  layout: 'default',
                })
              }
            >
              Default Layout
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                dialog.alert({
                  title: 'Vertical Layout',
                  description: 'Icon on top, title below, centered.',
                  variant: 'success',
                  layout: 'vertical',
                })
              }
            >
              Vertical Layout
            </Button>
          </Subsection>

          <Subsection title='Alert - Sizes'>
            <Button
              variant='outline'
              onClick={() =>
                dialog.alert({
                  title: 'Small (sm)',
                  description: 'max-w-sm (384px)',
                  variant: 'default',
                  size: 'sm',
                })
              }
            >
              Small
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                dialog.alert({
                  title: 'Medium (md)',
                  description: 'max-w-md (448px) - default',
                  variant: 'default',
                  size: 'md',
                })
              }
            >
              Medium
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                dialog.alert({
                  title: 'Large (lg)',
                  description: 'max-w-lg (512px)',
                  variant: 'default',
                  size: 'lg',
                })
              }
            >
              Large
            </Button>
          </Subsection>

          <Subsection title='Alert - Combined'>
            <Button
              variant='success'
              onClick={() =>
                dialog.alert({
                  title: 'Success!',
                  description: 'Your changes have been saved successfully.',
                  variant: 'success',
                  layout: 'vertical',
                  size: 'sm',
                })
              }
            >
              Vertical + Small
            </Button>
            <Button
              variant='destructive'
              onClick={() =>
                dialog.alert({
                  title: 'Error Occurred',
                  description: 'Failed to save your changes. Please try again later.',
                  variant: 'error',
                  layout: 'vertical',
                  size: 'lg',
                })
              }
            >
              Vertical + Large
            </Button>
          </Subsection>

          <Subsection title='Confirm - Basic'>
            <Button
              variant='outline'
              onClick={() =>
                dialog.confirm({
                  title: 'Confirm Action',
                  description: 'Are you sure you want to proceed?',
                  onConfirm: () => {
                    toast.success('Confirmed!');
                  },
                })
              }
            >
              Default Confirm
            </Button>
            <Button
              variant='destructive'
              onClick={() =>
                dialog.confirm({
                  title: 'Delete Item',
                  description: 'This action cannot be undone.',
                  variant: 'destructive',
                  confirmText: 'Delete',
                  onConfirm: () => {
                    toast.success('Deleted!');
                  },
                })
              }
            >
              Destructive Confirm
            </Button>
          </Subsection>

          <Subsection title='Confirm - Layouts & Sizes'>
            <Button
              variant='outline'
              onClick={() =>
                dialog.confirm({
                  title: 'Vertical Confirm',
                  description: 'This is a vertical layout confirm dialog.',
                  layout: 'vertical',
                  onConfirm: () => {
                    toast.success('Confirmed!');
                  },
                })
              }
            >
              Vertical Layout
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                dialog.confirm({
                  title: 'Small Confirm',
                  description: 'Compact confirm dialog.',
                  size: 'sm',
                  onConfirm: () => {
                    toast.success('Confirmed!');
                  },
                })
              }
            >
              Small Size
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                dialog.confirm({
                  title: 'Large Confirm',
                  description: 'This is a larger confirm dialog with more space.',
                  size: 'lg',
                  layout: 'vertical',
                  onConfirm: () => {
                    toast.success('Confirmed!');
                  },
                })
              }
            >
              Large + Vertical
            </Button>
          </Subsection>
        </Section>

        {/* Tooltips Section */}
        <Section
          id='tooltips'
          title='Tooltips'
        >
          <TooltipProvider>
            <Subsection title='Positions'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline'>Hover me (Top)</Button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  <p>Tooltip on top</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline'>Hover me (Bottom)</Button>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>Tooltip on bottom</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline'>Hover me (Left)</Button>
                </TooltipTrigger>
                <TooltipContent side='left'>
                  <p>Tooltip on left</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline'>Hover me (Right)</Button>
                </TooltipTrigger>
                <TooltipContent side='right'>
                  <p>Tooltip on right</p>
                </TooltipContent>
              </Tooltip>
            </Subsection>
          </TooltipProvider>
        </Section>

        {/* Toast Section */}
        <Section
          id='toast'
          title='Toast (Sonner)'
        >
          <Subsection title='Basic Types'>
            <Button
              variant='outline'
              onClick={() => toast('Default toast message')}
            >
              Default
            </Button>
            <Button
              variant='success-light'
              onClick={() => toast.success('Operation completed successfully!')}
            >
              Success
            </Button>
            <Button
              variant='destructive-light'
              onClick={() => toast.error('Something went wrong!')}
            >
              Error
            </Button>
            <Button
              variant='warning-light'
              onClick={() => toast.warning('Please check your input')}
            >
              Warning
            </Button>
            <Button
              variant='info-light'
              onClick={() => toast.info('Here is some information')}
            >
              Info
            </Button>
          </Subsection>

          <Subsection title='With Description'>
            <Button
              variant='outline'
              onClick={() =>
                toast.success('Changes saved', {
                  description: 'Your profile has been updated successfully.',
                })
              }
            >
              With Description
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                toast.error('Upload failed', {
                  description: 'The file size exceeds the maximum limit of 10MB.',
                })
              }
            >
              Error with Description
            </Button>
          </Subsection>

          <Subsection title='With Action'>
            <Button
              variant='outline'
              onClick={() =>
                toast('File deleted', {
                  action: {
                    label: 'Undo',
                    onClick: () => toast.success('File restored!'),
                  },
                })
              }
            >
              With Action
            </Button>
          </Subsection>

          <Subsection title='Promise'>
            <Button
              variant='outline'
              onClick={() => {
                const promise = new Promise(resolve => setTimeout(resolve, 2000));
                toast.promise(promise, {
                  loading: 'Loading...',
                  success: 'Data loaded successfully!',
                  error: 'Failed to load data',
                });
              }}
            >
              Promise Toast
            </Button>
          </Subsection>

          <Subsection title='Loading'>
            <Button
              variant='outline'
              onClick={() => {
                const toastId = toast.loading('Processing...');
                setTimeout(() => {
                  toast.success('Done!', { id: toastId });
                }, 2000);
              }}
            >
              Loading → Success
            </Button>
          </Subsection>
        </Section>

        {/* Separator */}
        <Section
          id='separator'
          title='Separator'
        >
          <div className='space-y-4 max-w-lg'>
            <div>Content above separator</div>
            <Separator />
            <div>Content below separator</div>
          </div>
        </Section>
      </main>
    </div>
  );
}
