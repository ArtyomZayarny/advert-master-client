# Components Documentation

## UI Components (shadcn/ui)

### Button
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon
- Usage: `<Button variant="outline" size="sm">Click me</Button>`

### Card
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Usage: Wrapper for content sections

### Input
- Standard text input with validation styling
- Usage: `<Input type="text" placeholder="Enter text" />`

### Select
- Dropdown select with search
- Usage: `<Select><SelectTrigger><SelectValue /></SelectTrigger></Select>`

### Textarea
- Multi-line text input
- Usage: `<Textarea rows={6} placeholder="Enter description" />`

### Label
- Form label component
- Usage: `<Label htmlFor="input">Label text</Label>`

### Badge
- Small status indicator
- Usage: `<Badge variant="default">New</Badge>`

### Dialog
- Modal dialog component
- Usage: `<Dialog><DialogContent>...</DialogContent></Dialog>`

### Skeleton
- Loading placeholder
- Usage: `<Skeleton className="h-4 w-3/4" />`

### Slider
- Range input slider
- Usage: `<Slider defaultValue={[50]} max={100} step={1} />`

## Layout Components

### Header
- Main navigation header
- Features: Logo, search bar, user menu, favorites link
- Responsive: Mobile menu, desktop search

## Page Components

### HomePage
- Hero section
- Categories grid
- Featured ads section

### AdvertsList
- Grid of ad cards
- Filters integration
- Pagination
- Loading states

### AdvertDetail
- Image gallery
- Ad information
- Seller details
- Action buttons (favorite, contact, archive)

### AddAdvertForm
- Multi-step form (category → details → photos)
- Category-specific fields
- Photo upload with preview
- Form validation

### EditAdvertForm
- Pre-filled form with existing data
- Photo management (existing + new)
- Category-specific fields

## Feature Components

### CategoriesGrid
- Grid of category cards
- Lucide-react icons
- Hover effects
- Responsive layout

### AdvertCard
- Reusable ad card component
- Favorite functionality
- Image with hover effects
- Price and location display

### ImageGallery
- Main image display
- Thumbnail navigation
- Full-screen modal
- Keyboard navigation support

### AdvertFilters
- Collapsible filter panel
- City filter
- Price range
- Sort options

### SearchResults
- Search query display
- Results grid
- Empty states
- Error handling

### FavoritesList
- Grouped by category
- Remove functionality
- Empty states

### ArchiveList
- Grouped by category
- Restore functionality
- Delete permanently
- Empty states

### ProfileContent
- User information display
- Quick actions
- User ads list

### UserAdverts
- User's ads grouped by category
- Edit/Delete actions
- Empty states

## Common Components

### ErrorBoundary
- React error boundary
- Error display
- Reset functionality

### LoadingSpinner
- Animated spinner
- Multiple sizes (sm, md, lg)

### Pagination
- Page navigation
- Page numbers
- Previous/Next buttons

## Component Patterns

### Form Pattern
```tsx
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {...}
});

<form onSubmit={form.handleSubmit(onSubmit)}>
  <Input {...form.register("field")} />
</form>
```

### Query Pattern
```tsx
const { data, isLoading } = useQuery({
  queryKey: ["key"],
  queryFn: () => api.getData(),
});
```

### Mutation Pattern
```tsx
const mutation = useMutation({
  mutationFn: api.updateData,
  onSuccess: () => toast.success("Success"),
});
```
