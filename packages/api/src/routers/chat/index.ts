/**
 * Chat Domain Module
 *
 * This module exports the chat router and all chat-related procedures.
 * Chat procedures handle conversation management, message history,
 * folder organization, and search functionality.
 */

import { crudRouter } from './crud';
import { searchRouter } from './search';
import { exportRouter } from './export';
import { organizationRouter } from './organization';

/**
 * Unified Chat Router
 *
 * Combines all chat-related procedures from domain modules:
 * - CRUD operations (create, read, update, delete)
 * - Search and filtering
 * - Export and reporting
 * - Organization (pinning, folders)
 */
export const chatRouter = {
  ...crudRouter,
  ...searchRouter,
  ...exportRouter,
  ...organizationRouter,
};
