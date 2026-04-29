# Food Ingredient Tracking App Design (FoodExpireCheck)

**Date:** 2026-04-29
**Status:** Draft
**Primary User:** Single household / Individual (Priority: Speed & Simplicity)

## 1. Goal
A mobile-friendly web application to track food expiration dates. It allows users to quickly log ingredients using presets and visualize their remaining shelf life through a color-coded timeline list.

## 2. Tech Stack
- **Frontend:** React 19 (TypeScript)
- **Styling:** Vanilla CSS (using CSS Variables for dynamic coloring)
- **Database/Backend:** Supabase (PostgreSQL)
- **Hosting:** GitHub Pages
- **Version Control:** GitHub

## 3. Data Model (Supabase)

### Table: `ingredients`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key, Default: `uuid_generate_v4()` | Unique identifier |
| `name` | Text | Not Null | Name of the food (e.g., "Milk") |
| `category` | Text | | Emoji or icon identifier |
| `added_at` | Timestamp | Default: `now()` | Date added to the system |
| `expires_at` | Timestamp | Not Null | The expiration date |
| `is_consumed` | Boolean | Default: `false` | Whether the item has been used/deleted |
| `user_id` | UUID | | (Optional) For future multi-user support |

## 4. UI/UX Design

### Dashboard (Main Screen)
- **Status Summary**: High-level counts (e.g., "2 Expired", "3 Soon").
- **Ingredient List**: Sorted by `expires_at` (ascending).
- **Ingredient Card**:
  - Name and Category Icon.
  - **Timeline Bar**: A visual progress bar representing time left.
  - **Color Coding**:
    - **Green**: > 3 days remaining.
    - **Yellow**: 1-3 days remaining.
    - **Red**: 0 days or expired.
- **Consumption Action**: A "Check" button or swipe-to-complete action to mark items as consumed.

### Add Panel (Overlay or Bottom Sheet)
- **Fast Add (Presets)**:
  - Buttons for common items: "Milk" (7d), "Eggs" (14d), "Meat" (3d), "Veg" (5d).
  - Tapping a preset creates an entry immediately with a calculated `expires_at`.
- **Manual Entry**:
  - Text input for name.
  - Simple date picker for expiration date.

## 5. Implementation Phases
1. **Phase 1: Setup**: Initialize React project and Supabase client.
2. **Phase 2: Database**: Create the `ingredients` table and RLS policies.
3. **Phase 3: Core UI**: Build the Dashboard and Ingredient List.
4. **Phase 4: Add Logic**: Implement Presets and Manual Add.
5. **Phase 5: Refinement**: Add color-coding logic and timeline bars.
6. **Phase 6: Deployment**: Configure GitHub Actions for GitHub Pages.

## 6. Testing Strategy
- **Unit Tests**: Logic for color-coding and date calculations.
- **Component Tests**: Rendering of the Ingredient Card with different expiration states.
- **Integration Tests**: Supabase fetch and save operations.
