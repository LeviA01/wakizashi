import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { colors, commonStyles } from '../styles';
import { BlockEditForm } from './BlockEditForm';

type BlockType = 'command' | 'autoReply' | 'custom';

interface Block {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  settings: {
    command?: string;
    triggers?: string[];
    response: {
      text: string;
      image_url?: string;
      buttons?: Array<{
        text: string;
        callback: string;
      }>;
    };
    custom_function?: string;
    conditions?: {
      only_if_admin?: boolean;
    };
  };
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ blocks, onChange }) => {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [showAddButtons, setShowAddButtons] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartCoords, setDragStartCoords] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);
  const clickThreshold = 5; // pixels

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      settings: {
        response: {
          text: '',
        },
      },
    };
    onChange([...blocks, newBlock]);
    setShowAddButtons(false);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    const newBlocks = blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    );
    onChange(newBlocks);
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(block => block.id !== id));
  };

  const handleMouseDown = (e: React.MouseEvent, block: Block) => {
    // Prevent drag if clicking on remove button
    if (e.target instanceof HTMLElement && e.target.closest('button')) return;
    
    setIsDragging(false); // Assume it's a click initially
    setSelectedBlock(null); // Deselect any previously selected block
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDragStartCoords({ x: e.clientX, y: e.clientY });
    
    // Attach mousemove and mouseup listeners to the window to handle dragging outside the block
    window.addEventListener('mousemove', handleMouseMove as any);
    window.addEventListener('mouseup', handleMouseUp as any);
    
    // Store the block being considered for drag/click
    (e.currentTarget as any).__currentBlock = block;
  };

  const handleMouseMove = (e: MouseEvent) => {
    const currentBlock = (e.target as any)?.__currentBlock as Block | undefined;
    if (!currentBlock || !boardRef.current) return;

    const dx = Math.abs(e.clientX - dragStartCoords.x);
    const dy = Math.abs(e.clientY - dragStartCoords.y);

    // If mouse moved beyond threshold, it's a drag
    if (dx > clickThreshold || dy > clickThreshold) {
      setIsDragging(true);
      const boardRect = boardRef.current.getBoundingClientRect();
      const x = e.clientX - boardRect.left - dragOffset.x;
      const y = e.clientY - boardRect.top - dragOffset.y;
      updateBlock(currentBlock.id, { x, y });
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    const currentBlock = (e.target as any)?.__currentBlock as Block | undefined;
    
    // Clean up event listeners
    window.removeEventListener('mousemove', handleMouseMove as any);
    window.removeEventListener('mouseup', handleMouseUp as any);
    
    if (!currentBlock) return;

    if (!isDragging) {
      // If it was a click (not a drag), open the editor
      setSelectedBlock(currentBlock);
    } else {
      // If it was a drag, snap to grid
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (boardRect) {
        const snappedX = Math.round((currentBlock.x) / gridSize) * gridSize;
        const snappedY = Math.round((currentBlock.y) / gridSize) * gridSize;
        updateBlock(currentBlock.id, { x: snappedX, y: snappedY });
      }
    }

    setIsDragging(false);
    // Clean up the stored block reference
    if (e.target instanceof HTMLElement) {
      delete (e.target as any).__currentBlock;
    }
  };

  const gridSize = 40;
  const gridColor = colors.border;

  const panelWidthExpanded = '200px'; // Desired width when expanded
  const panelWidthCollapsed = '60px'; // Desired width when collapsed (slightly larger than button)

  return (
    <div style={{
      ...commonStyles.container,
      minHeight: 'calc(100vh - 200px)',
      paddingLeft: '0%', // Add 5% left margin to the entire component
      paddingTop: '20px', // Add top padding
      paddingRight: '20px', // Add right padding
      paddingBottom: '20px', // Add bottom padding
    }}>
      {/* Container for left panel and whiteboard */}
      <div style={{
        display: 'flex',
        gap: '20px',
        width: '100%', // Take full width within the outer padding
        minHeight: 'calc(100vh - 240px)', // Adjust height calculation
      }}>
        {/* Левая панель с кнопками */}
        <div style={{
          ...commonStyles.card,
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: showAddButtons ? '20px' : '10px', // Adjust padding based on state
          width: showAddButtons ? panelWidthExpanded : panelWidthCollapsed, // Dynamic width
          minWidth: showAddButtons ? panelWidthExpanded : panelWidthCollapsed, // Dynamic minWidth
          transition: 'width 0.3s ease, min-width 0.3s ease', // Smooth transition
          overflow: 'hidden', // Hide overflow in collapsed state
        }}>
          <button
            onClick={() => setShowAddButtons(!showAddButtons)}
            style={{
              ...commonStyles.button,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              padding: 0,
              marginBottom: showAddButtons ? '20px' : '0', // Add margin when expanded
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0, // Prevent button from shrinking
            }}
          >
            +
          </button>

          {/* Container for block type buttons - shown only when expanded */}
          <div style={{
            display: showAddButtons ? 'flex' : 'none', // Show/hide based on state
            flexDirection: 'column',
            gap: '10px',
            borderRadius: '4px',
            width: '100%', // Ensure buttons container takes full width of expanded panel
            opacity: showAddButtons ? 1 : 0, // Fade in/out
            transition: 'opacity 0.3s ease 0.1s', // Delayed fade-in
          }}>
              <button
                onClick={() => addBlock('command')}
                style={{
                  ...commonStyles.button,
                  width: '100%',
                  backgroundColor: colors.surfaceHover,
                }}
              >
                Команда
              </button>
              <button
                onClick={() => addBlock('autoReply')}
                style={{
                  ...commonStyles.button,
                  width: '100%',
                  backgroundColor: colors.surfaceHover,
                }}
              >
                Автоответ
              </button>
              <button
                onClick={() => addBlock('custom')}
                style={{
                  ...commonStyles.button,
                  width: '100%',
                  backgroundColor: colors.surfaceHover,
                }}
              >
                Кастомный блок
              </button>
            </div>
        </div>

        {/* Основная область с блоками (вайтборд) */}
        <div 
          ref={boardRef}
          style={{
            flex: 1, // Allow whiteboard to take remaining space
            ...commonStyles.card,
            position: 'relative',
            minHeight: '800px',
            minWidth: '1200px', // Allow horizontal expansion
            overflow: 'auto', // Add scrollbars
            background: `
              linear-gradient(to right, ${gridColor} 1px, transparent 1px),
              linear-gradient(to bottom, ${gridColor} 1px, ${colors.background} 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        >
          {blocks.length === 0 ? (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: colors.text,
              opacity: 0.7,
            }}>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                Нет добавленных блоков
              </p>
              <p style={{ fontSize: '14px' }}>
                Нажмите "+" слева, чтобы добавить новый блок
              </p>
            </div>
          ) : (
            blocks.map((block) => (
              <div
                key={block.id}
                style={{
                  position: 'absolute',
                  left: block.x,
                  top: block.y,
                  ...commonStyles.card,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  width: '300px',
                  userSelect: 'none',
                  transform: isDragging && selectedBlock?.id === block.id ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                  zIndex: selectedBlock?.id === block.id ? 1000 : 1,
                }}
                onMouseDown={(e) => handleMouseDown(e, block)}
              >
                <div>
                  <h3 style={{ 
                    margin: '0 0 10px 0', 
                    color: colors.text,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    {block.type === 'command' ? '📝 Команда' : 
                     block.type === 'autoReply' ? '🤖 Автоответ' : '⚙️ Кастомный блок'}
                  </h3>
                  <p style={{ 
                    margin: '0', 
                    color: colors.textSecondary,
                  }}>
                    {block.type === 'command' ? block.settings.command :
                     block.type === 'autoReply' ? block.settings.triggers?.join(', ') :
                     block.settings.custom_function || 'Кастомный блок'}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBlock(block.id);
                  }}
                  style={{
                    ...commonStyles.button,
                    backgroundColor: colors.error,
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '5px 10px',
                    fontSize: '12px',
                    opacity: 0.7,
                  }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedBlock && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              ...commonStyles.card,
              width: '80%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <BlockEditForm
              block={selectedBlock}
              onSave={(updatedBlock) => {
                updateBlock(updatedBlock.id, updatedBlock);
                setSelectedBlock(null);
              }}
              onCancel={() => setSelectedBlock(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 