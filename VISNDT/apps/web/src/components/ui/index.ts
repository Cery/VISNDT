/**
 * VISNDT Web UI Primitives —— Web Foundation Layer（WP-2）。
 * 统一基础能力；业务页面在 Page Batch 中消费。
 * 通用原语（Button/Input/Card/Badge/Tag/Status/Empty/Loading/Pagination）由 @visndt/design-system 提供，
 * 此处仅建立 Web 侧缺失的 Form / Search / Table / Overlay / Tabs / Responsive primitives。
 */

// Form controls
export { Textarea } from './Textarea';
export type { TextareaProps } from './Textarea';
export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';
export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';
export { RadioGroup } from './Radio';
export type { RadioGroupProps, RadioOption } from './Radio';
export { SearchInput } from './SearchInput';
export type { SearchInputProps } from './SearchInput';

// Data display
export { Table } from './Table';
export type { TableProps, TableColumn, TablePagination } from './Table';

// Overlay
export { Modal } from './Modal';
export type { ModalProps } from './Modal';
export { Drawer } from './Drawer';
export type { DrawerProps } from './Drawer';

// Navigation
export { Tabs } from './Tabs';
export type { TabsProps, TabItem } from './Tabs';

// Form semantics
export { FormField, FieldLabel, FieldMessage, FormSection } from './Form';
export type { FormFieldProps, FieldLabelProps, FieldMessageProps, FormSectionProps } from './Form';

// Responsive / Layout
export { Container, Grid, Stack, Flex, Visibility } from './Layout';
export type { ContainerProps, GridProps, StackProps, FlexProps, VisibilityProps } from './Layout';

// Shared field styles
export { inputBase, labelText, helperText, errorText, focusRing, requiredMark } from './fieldStyles';