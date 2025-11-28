import { Request, Response } from 'express';
import * as mappingService from './mapping.service';

export async function listMappings(req: Request, res: Response) {
  try {
    const mappings = await mappingService.getAllMappings();
    res.json(mappings);
  } catch (error) {
    console.error('Error listing mappings:', error);
    res.status(500).json({ error: 'Failed to list mappings' });
  }
}

export async function getMapping(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const mapping = await mappingService.getMappingById(id);
    if (!mapping) {
      return res.status(404).json({ error: 'Mapping not found' });
    }
    res.json(mapping);
  } catch (error) {
    console.error('Error getting mapping:', error);
    res.status(500).json({ error: 'Failed to get mapping' });
  }
}

export async function getMappingByForm(req: Request, res: Response) {
  try {
    const { formId } = req.params;
    const mapping = await mappingService.getMappingByFormId(formId);
    if (!mapping) {
      return res.status(404).json({ error: 'No mapping found for this form' });
    }
    res.json(mapping);
  } catch (error) {
    console.error('Error getting mapping by form:', error);
    res.status(500).json({ error: 'Failed to get mapping' });
  }
}

export async function createMapping(req: Request, res: Response) {
  try {
    const { formId, formName, agentId, agentName, isActive } = req.body;
    
    if (!formId || !agentId) {
      return res.status(400).json({ error: 'Form ID and Agent ID are required' });
    }

    const mapping = await mappingService.createMapping({
      formId,
      formName: formName || 'Unknown Form',
      agentId,
      agentName: agentName || 'Unknown Agent',
      isActive: isActive ?? true,
    });

    res.status(201).json(mapping);
  } catch (error) {
    console.error('Error creating mapping:', error);
    res.status(500).json({ error: 'Failed to create mapping' });
  }
}

export async function updateMapping(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const mapping = await mappingService.updateMapping(id, updates);
    if (!mapping) {
      return res.status(404).json({ error: 'Mapping not found' });
    }

    res.json(mapping);
  } catch (error) {
    console.error('Error updating mapping:', error);
    res.status(500).json({ error: 'Failed to update mapping' });
  }
}

export async function deleteMapping(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await mappingService.deleteMapping(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Mapping not found' });
    }

    res.json({ success: true, message: 'Mapping deleted successfully' });
  } catch (error) {
    console.error('Error deleting mapping:', error);
    res.status(500).json({ error: 'Failed to delete mapping' });
  }
}
